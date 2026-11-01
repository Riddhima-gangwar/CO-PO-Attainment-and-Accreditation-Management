import { NextResponse } from 'next/server';
import { PO } from '@/models/PO';
import { ensureDatabaseSeeded } from '@/lib/dbSeeder';
import { mockProgramOutcomes } from '@/data/mockData';

export async function GET() {
  try {
    let posList: any[] = [];
    try {
      await ensureDatabaseSeeded();
      const docs = await PO.find().sort({ code: 1 });
      posList = docs.map((d) => ({
        id: d._id.toString(),
        code: d.code,
        title: d.title,
        statement: d.statement,
        targetScore: d.targetScore,
      }));
    } catch {
      posList = mockProgramOutcomes;
    }

    return NextResponse.json({
      success: true,
      count: posList.length,
      data: posList,
    });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Error fetching POs';
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}
