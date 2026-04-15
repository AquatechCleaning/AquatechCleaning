import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import { Job } from "@/lib/models/Job";
import { Quote } from "@/lib/models/Quote";

type ScheduleType = "half_day" | "full_day" | "multiple_days";
type ScheduleSlot = "morning" | "afternoon";

const parseLocalDate = (value: string) => {
  const [year, month, day] = value.split("-").map(Number);
  if (!year || !month || !day) return null;
  return new Date(year, month - 1, day);
};

const setTime = (date: Date, hour: number) => {
  const result = new Date(date);
  result.setHours(hour, 0, 0, 0);
  return result;
};

const resolveScheduleRange = ({
  scheduleType,
  scheduleSlot,
  startDate,
  endDate,
}: {
  scheduleType: ScheduleType;
  scheduleSlot?: ScheduleSlot;
  startDate: string;
  endDate?: string;
}) => {
  const startDay = parseLocalDate(startDate);
  if (!startDay) throw new Error("Invalid start date");

  if (scheduleType === "half_day") {
    if (scheduleSlot !== "morning" && scheduleSlot !== "afternoon") {
      throw new Error("Choose morning or afternoon for half-day jobs");
    }
    return {
      start: setTime(startDay, scheduleSlot === "morning" ? 8 : 13),
      end: setTime(startDay, scheduleSlot === "morning" ? 12 : 17),
    };
  }

  if (scheduleType === "full_day") {
    return {
      start: setTime(startDay, 8),
      end: setTime(startDay, 17),
    };
  }

  const finalDay = parseLocalDate(endDate || startDate);
  if (!finalDay) throw new Error("Invalid end date");
  if (finalDay < startDay) throw new Error("End date must be after start date");

  return {
    start: setTime(startDay, 8),
    end: setTime(finalDay, 17),
  };
};

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { quoteId, scheduleType, scheduleSlot, startDate, endDate, teamName, notes } = body as {
      quoteId?: string;
      scheduleType?: ScheduleType;
      scheduleSlot?: ScheduleSlot;
      startDate?: string;
      endDate?: string;
      teamName?: string;
      notes?: string;
    };

    if (!quoteId) {
      return NextResponse.json({ error: "quoteId required" }, { status: 400 });
    }

    if (!scheduleType || !["half_day", "full_day", "multiple_days"].includes(scheduleType)) {
      return NextResponse.json({ error: "Valid scheduleType required" }, { status: 400 });
    }

    if (!startDate) {
      return NextResponse.json({ error: "startDate required" }, { status: 400 });
    }

    const schedule = resolveScheduleRange({ scheduleType, scheduleSlot, startDate, endDate });

    await dbConnect();
    const quote = await Quote.findById(quoteId);
    if (!quote) return NextResponse.json({ error: "Quote not found" }, { status: 404 });
    if (quote.status !== "Accepted" && quote.status !== "Scheduled") {
      return NextResponse.json({ error: "Only accepted quotes can be scheduled" }, { status: 400 });
    }

    let job = await Job.findOne({ quoteId: quote._id });
    if (!job) {
      job = await Job.create({
        quoteId: quote._id,
        customerId: quote.customerId,
        propertyId: quote.propertyId,
        servicesPerformed: quote.areas,
        totalAreaSqm: quote.areas.reduce((sum, area) => sum + (area.sqm || 0), 0),
        actualAmountCharged: quote.totalAmount,
        scheduledDate: schedule.start,
        scheduledEndDate: schedule.end,
        scheduleType,
        scheduleSlot,
        teamName,
        notes,
        status: "Scheduled",
      });

    } else {
      job.scheduledDate = schedule.start;
      job.scheduledEndDate = schedule.end;
      job.scheduleType = scheduleType;
      job.scheduleSlot = scheduleSlot;
      job.teamName = teamName;
      job.notes = notes;
      job.status = "Scheduled";
      await job.save();
    }

    quote.status = "Scheduled";
    await quote.save();

    return NextResponse.json({ success: true, jobId: job._id });
  } catch (error) {
    console.error(error);
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: "Unable to schedule quote", details: message }, { status: 500 });
  }
}
