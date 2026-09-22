import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  GraduationCap, 
  ArrowUpRight, 
  CheckCircle2, 
  AlertCircle 
} from 'lucide-react';

export default function DashboardPage() {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Header section */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">Overview</h1>
          <p className="text-gray-500 mt-1">Monitor attainment metrics and accreditation status</p>
        </div>
        <div className="mt-4 md:mt-0 flex gap-3">
          <button className="px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg shadow-sm hover:bg-gray-50 transition-colors font-medium text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
            Download Report
          </button>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow-sm hover:bg-blue-700 transition-colors font-medium text-sm shadow-blue-500/20 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
            Generate Mapping
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        
        {/* Stat Card 1 */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 relative overflow-hidden group hover:shadow-md transition-shadow">
          <div className="absolute top-0 right-0 p-4 opacity-10 text-blue-600 group-hover:scale-110 group-hover:opacity-20 transition-all duration-300">
            <GraduationCap size={64} />
          </div>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
              <GraduationCap className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Active Programs</p>
              <h3 className="text-2xl font-bold text-gray-900">12</h3>
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <span className="flex items-center text-emerald-600 font-medium">
              <ArrowUpRight className="h-4 w-4 mr-1" />
              14%
            </span>
            <span className="text-gray-400 ml-2">from last semester</span>
          </div>
        </div>

        {/* Stat Card 2 */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 relative overflow-hidden group hover:shadow-md transition-shadow">
          <div className="absolute top-0 right-0 p-4 opacity-10 text-indigo-600 group-hover:scale-110 group-hover:opacity-20 transition-all duration-300">
            <Users size={64} />
          </div>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600">
              <Users className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Total Students</p>
              <h3 className="text-2xl font-bold text-gray-900">3,492</h3>
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <span className="flex items-center text-emerald-600 font-medium">
              <ArrowUpRight className="h-4 w-4 mr-1" />
              5%
            </span>
            <span className="text-gray-400 ml-2">from last year</span>
          </div>
        </div>

        {/* Stat Card 3 */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 relative overflow-hidden group hover:shadow-md transition-shadow">
          <div className="absolute top-0 right-0 p-4 opacity-10 text-emerald-600 group-hover:scale-110 group-hover:opacity-20 transition-all duration-300">
            <BarChart3 size={64} />
          </div>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600">
              <BarChart3 className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Avg PO Attainment</p>
              <h3 className="text-2xl font-bold text-gray-900">76.4%</h3>
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <span className="flex items-center text-emerald-600 font-medium">
              <ArrowUpRight className="h-4 w-4 mr-1" />
              2.1%
            </span>
            <span className="text-gray-400 ml-2">across all branches</span>
          </div>
        </div>

        {/* Stat Card 4 */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 relative overflow-hidden group hover:shadow-md transition-shadow">
          <div className="absolute top-0 right-0 p-4 opacity-10 text-amber-500 group-hover:scale-110 group-hover:opacity-20 transition-all duration-300">
            <CheckCircle2 size={64} />
          </div>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-amber-50 flex items-center justify-center text-amber-600">
              <CheckCircle2 className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Accreditation Readiness</p>
              <h3 className="text-2xl font-bold text-gray-900">82%</h3>
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <span className="flex items-center text-amber-600 font-medium">
              <TrendingUp className="h-4 w-4 mr-1" />
              In Progress
            </span>
            <span className="text-gray-400 ml-2">3 pending items</span>
          </div>
        </div>

      </div>

      {/* Main Content Area: Charts & Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Chart Section */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-100 shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-bold text-gray-900">Program Attainment Trends</h2>
              <p className="text-sm text-gray-500">Comparing PO attainment across departments</p>
            </div>
            <select className="bg-gray-50 border border-gray-200 text-gray-700 rounded-lg text-sm focus:ring-blue-500 focus:border-blue-500 block p-2">
              <option>Last 4 Semesters</option>
              <option>Last Year</option>
              <option>All Time</option>
            </select>
          </div>
          
          {/* Chart Placeholder */}
          <div className="h-72 w-full bg-gradient-to-tr from-gray-50 to-white border border-gray-100 border-dashed rounded-xl flex flex-col items-center justify-center">
            <BarChart3 className="h-12 w-12 text-gray-300 mb-4" />
            <p className="text-gray-400 font-medium">Interactive Chart Implementation Pending</p>
            <p className="text-gray-400 text-sm mt-1">Will display attainment bar charts per branch</p>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-6">Action Items & Activity</h2>
          
          <div className="space-y-6">
            <div className="flex gap-4">
              <div className="mt-1 bg-red-100 p-2 rounded-full text-red-600 shrink-0">
                <AlertCircle className="h-4 w-4" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">Missing CO-PO Mapping</p>
                <p className="text-sm text-gray-500 mt-1">Computer Science department has 3 courses without mapping.</p>
                <button className="text-blue-600 text-sm font-medium mt-2 hover:underline">Resolve now &rarr;</button>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="mt-1 bg-amber-100 p-2 rounded-full text-amber-600 shrink-0">
                <AlertCircle className="h-4 w-4" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">Evidence Pending Review</p>
                <p className="text-sm text-gray-500 mt-1">Criteria 3.1 documents submitted by Mech. Eng. need approval.</p>
                <button className="text-blue-600 text-sm font-medium mt-2 hover:underline">Review documents &rarr;</button>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="mt-1 bg-emerald-100 p-2 rounded-full text-emerald-600 shrink-0">
                <CheckCircle2 className="h-4 w-4" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">Assessment Processed</p>
                <p className="text-sm text-gray-500 mt-1">Mid-term marks for Data Structures (CS301) successfully imported.</p>
                <p className="text-xs text-gray-400 mt-1">2 hours ago</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
    </div>
  );
}
