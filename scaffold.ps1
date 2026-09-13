$dirs = @(
    "src/components/ui",
    "src/components/layout",
    "src/components/dashboard",
    "src/components/programs",
    "src/components/courses",
    "src/components/outcomes",
    "src/components/assessments",
    "src/components/attainment",
    "src/components/accreditation",
    "src/components/reports",
    "src/lib/db",
    "src/lib/auth",
    "src/lib/validations",
    "src/lib/utils",
    "src/models",
    "src/services",
    "src/types",
    "src/constants",
    "src/config",
    "src/app/api/auth",
    "src/app/api/users",
    "src/app/api/programs",
    "src/app/api/courses",
    "src/app/api/co",
    "src/app/api/po",
    "src/app/api/pso",
    "src/app/api/mappings",
    "src/app/api/assessments",
    "src/app/api/students",
    "src/app/api/marks",
    "src/app/api/attainment/co",
    "src/app/api/attainment/po",
    "src/app/api/accreditation",
    "src/app/api/evidence",
    "src/app/api/reports",
    "src/app/(auth)/login",
    "src/app/(dashboard)/dashboard",
    "src/app/(dashboard)/programs/[id]",
    "src/app/(dashboard)/courses/[id]",
    "src/app/(dashboard)/course-outcomes",
    "src/app/(dashboard)/program-outcomes",
    "src/app/(dashboard)/program-specific-outcomes",
    "src/app/(dashboard)/assessments",
    "src/app/(dashboard)/student-marks",
    "src/app/(dashboard)/co-attainment",
    "src/app/(dashboard)/co-po-mapping",
    "src/app/(dashboard)/po-attainment",
    "src/app/(dashboard)/accreditation/criteria",
    "src/app/(dashboard)/accreditation/evidence",
    "src/app/(dashboard)/accreditation/compliance",
    "src/app/(dashboard)/reports/co",
    "src/app/(dashboard)/reports/po",
    "src/app/(dashboard)/reports/co-po",
    "src/app/(dashboard)/reports/accreditation",
    "src/app/(dashboard)/users",
    "src/app/(dashboard)/settings",
    "src/app/(dashboard)/activity-logs"
)

foreach ($dir in $dirs) {
    New-Item -ItemType Directory -Force -Path $dir | Out-Null
}

# Create model files
$models = @("User", "Program", "PEO", "PO", "PSO", "Course", "CO", "COPOMap", "Assessment", "AssessmentQuestion", "Student", "StudentMark", "COAttainment", "POAttainment", "AccreditationFramework", "AccreditationCriterion", "EvidenceDocument", "ActivityLog")
foreach ($model in $models) {
    $content = @"
import mongoose from 'mongoose';

const ${model}Schema = new mongoose.Schema({
  // Placeholder fields
  createdAt: { type: Date, default: Date.now }
});

export const ${model} = mongoose.models.${model} || mongoose.model('${model}', ${model}Schema);
"@
    Set-Content -Path "src/models/${model}.ts" -Value $content
}

# Create page files for routes
$appRoutes = @(
    "src/app/(auth)/login",
    "src/app/(dashboard)/dashboard",
    "src/app/(dashboard)/programs",
    "src/app/(dashboard)/programs/[id]",
    "src/app/(dashboard)/courses",
    "src/app/(dashboard)/courses/[id]",
    "src/app/(dashboard)/course-outcomes",
    "src/app/(dashboard)/program-outcomes",
    "src/app/(dashboard)/program-specific-outcomes",
    "src/app/(dashboard)/assessments",
    "src/app/(dashboard)/student-marks",
    "src/app/(dashboard)/co-attainment",
    "src/app/(dashboard)/co-po-mapping",
    "src/app/(dashboard)/po-attainment",
    "src/app/(dashboard)/accreditation",
    "src/app/(dashboard)/accreditation/criteria",
    "src/app/(dashboard)/accreditation/evidence",
    "src/app/(dashboard)/accreditation/compliance",
    "src/app/(dashboard)/reports",
    "src/app/(dashboard)/reports/co",
    "src/app/(dashboard)/reports/po",
    "src/app/(dashboard)/reports/co-po",
    "src/app/(dashboard)/reports/accreditation",
    "src/app/(dashboard)/users",
    "src/app/(dashboard)/settings",
    "src/app/(dashboard)/activity-logs"
)

foreach ($route in $appRoutes) {
    if (-not (Test-Path $route)) {
        New-Item -ItemType Directory -Force -Path $route | Out-Null
    }
    
    # Extract route name for component
    $routeName = $route.Split("/")[-1]
    if ($routeName -eq "[id]") {
        $routeName = $route.Split("/")[-2] + "Details"
    }
    $routeName = (Get-Culture).TextInfo.ToTitleCase($routeName.Replace("-", " ")) -replace " ", ""

    $content = @"
export default function ${routeName}Page() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">${routeName}</h1>
      <p>Placeholder for ${routeName} functionality.</p>
    </div>
  );
}
"@
    Set-Content -Path "$route/page.tsx" -Value $content
}

# Create API route placeholders
$apiRoutes = @(
    "src/app/api/auth",
    "src/app/api/users",
    "src/app/api/programs",
    "src/app/api/courses",
    "src/app/api/co",
    "src/app/api/po",
    "src/app/api/pso",
    "src/app/api/mappings",
    "src/app/api/assessments",
    "src/app/api/students",
    "src/app/api/marks",
    "src/app/api/attainment/co",
    "src/app/api/attainment/po",
    "src/app/api/accreditation",
    "src/app/api/evidence",
    "src/app/api/reports"
)

foreach ($api in $apiRoutes) {
    if (-not (Test-Path $api)) {
        New-Item -ItemType Directory -Force -Path $api | Out-Null
    }
    $content = @"
import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({ message: 'API route placeholder' });
}
"@
    Set-Content -Path "$api/route.ts" -Value $content
}

Write-Host "Scaffolding completed successfully."
