"use client"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  FileText,
  Users,
  Pill,
  Target,
  Loader2,
  Plus,
  Search,
  Filter,
  Edit,
  Trash2,
  Copy,
  Building,
  Globe,
  TrendingUp,
  BarChart3,
  Clock,
  Settings,
  Bell,
  User,
  ChevronDown,
  Database,
  LineChart,
  Download,
  AlertTriangle,
  RefreshCw,
} from "lucide-react"
import { useStudies, Study } from "@/hooks/useStudies"
import { getProcessingStatusColor, getPriorityColor, getStatusColor } from "@/lib/clinical-utils"

interface StudiesListViewProps {
  handleCreateNewStudy: () => void
  setSelectedStudy: (studyId: string) => void
  setCurrentView: (view: "studies" | "study" | "upload" | "new-study") => void
  setEditMode?: (editMode: boolean) => void
}

export function StudiesListView({ handleCreateNewStudy, setSelectedStudy, setCurrentView, setEditMode }: StudiesListViewProps) {
  const { studies, loading, error } = useStudies();

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex justify-center items-center h-64">
            <div className="flex flex-col items-center gap-4">
              <Loader2 className="h-8 w-8 animate-spin text-red-600" />
              <p className="text-gray-600">Loading studies...</p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex justify-center items-center h-64">
            <div className="flex flex-col items-center gap-4 text-center">
              <div className="p-3 bg-red-100 rounded-full">
                <AlertTriangle className="h-8 w-8 text-red-600" />
              </div>
              <div>
                <p className="text-lg font-semibold text-gray-900">Error Loading Studies</p>
                <p className="text-gray-600 mt-1">{error}</p>
              </div>
              <Button onClick={() => window.location.reload()} variant="outline" className="mt-4">
                <RefreshCw className="h-4 w-4 mr-2" />
                Retry
              </Button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Clinical Studies</h2>
              <p className="text-gray-600 mt-1">Manage and monitor your clinical trial portfolio</p>
            </div>
            <Button onClick={handleCreateNewStudy} className="bg-red-600 hover:bg-red-700 text-white">
              <Plus className="h-4 w-4 mr-2" />
              New Study
            </Button>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-white border border-gray-200 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Active Studies</p>
                  <p className="text-2xl font-bold text-gray-900">8</p>
                  <p className="text-xs text-emerald-600 mt-1">↑ 2 from last month</p>
                </div>
                <div className="p-3 bg-emerald-100 rounded-lg">
                  <TrendingUp className="h-6 w-6 text-emerald-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border border-gray-200 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Participants</p>
                  <p className="text-2xl font-bold text-gray-900">2,847</p>
                  <p className="text-xs text-blue-600 mt-1">↑ 156 this week</p>
                </div>
                <div className="p-3 bg-blue-100 rounded-lg">
                  <Users className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border border-gray-200 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Global Sites</p>
                  <p className="text-2xl font-bold text-gray-900">47</p>
                  <p className="text-xs text-purple-600 mt-1">Across 12 countries</p>
                </div>
                <div className="p-3 bg-purple-100 rounded-lg">
                  <Globe className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border border-gray-200 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Avg. Completion</p>
                  <p className="text-2xl font-bold text-gray-900">73%</p>
                  <p className="text-xs text-orange-600 mt-1">On track</p>
                </div>
                <div className="p-3 bg-orange-100 rounded-lg">
                  <BarChart3 className="h-6 w-6 text-orange-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Search */}
        <Card className="bg-white border border-gray-200 shadow-sm mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
              <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center flex-1">
                <div className="relative flex-1 max-w-md">
                  <Search className="h-4 w-4 absolute left-3 top-3 text-gray-400" />
                  <Input
                    placeholder="Search studies, protocols, or sponsors..."
                    className="pl-10 border-gray-300 focus:border-red-500 focus:ring-red-500"
                  />
                </div>
                <div className="flex gap-2">
                  <Select>
                    <SelectTrigger className="w-32 border-gray-300">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="recruiting">Recruiting</SelectItem>
                      <SelectItem value="planning">Planning</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select>
                    <SelectTrigger className="w-32 border-gray-300">
                      <SelectValue placeholder="Phase" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Phases</SelectItem>
                      <SelectItem value="phase1">Phase 1</SelectItem>
                      <SelectItem value="phase2">Phase 2</SelectItem>
                      <SelectItem value="phase3">Phase 3</SelectItem>
                      <SelectItem value="phase4">Phase 4</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <Button variant="outline" className="border-gray-300 bg-transparent">
                <Filter className="h-4 w-4 mr-2" />
                More Filters
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Studies List */}
        <Card className="bg-white border border-gray-200 shadow-sm">
          <CardHeader className="border-b border-gray-200 bg-gray-50/50">
            <div className="flex justify-between items-center">
              <div>
                <CardTitle className="text-lg font-semibold text-gray-900 flex items-center">
                  <FileText className="h-5 w-5 mr-2 text-red-600" />
                  Study Portfolio
                </CardTitle>
                <CardDescription className="text-gray-600">
                  {studies.length} studies • Last updated 2 minutes ago
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-gray-100">
              {studies.map((study: Study) => (
                <div
                  key={study.id}
                  className="p-6 hover:bg-gray-50/50 transition-colors duration-150 cursor-pointer"
                  onClick={() => {
                    setSelectedStudy(study.id)
                    setCurrentView("study")
                  }}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      {/* Study Header */}
                      <div className="flex items-center space-x-3 mb-3">
                        <h3 className="text-lg font-semibold text-gray-900">{study.id}</h3>
                        <Badge className={getStatusColor(study.status)} variant="outline">
                          {study.status}
                        </Badge>
                        <Badge className={getProcessingStatusColor(study.processingStatus)} variant="outline">
                          {study.processingStatus === "PROCESSING" && <Loader2 className="h-3 w-3 mr-1 animate-spin" />}
                          {study.processingStatus}
                        </Badge>
                        <Badge className={getPriorityColor(study.priority)} variant="outline">
                          {study.priority}
                        </Badge>
                      </div>

                      {/* Study Title */}
                      <p className="text-gray-900 font-medium mb-2">{study.title}</p>

                      {/* Study Details */}
                      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-sm text-gray-600 mb-3">
                        <div className="flex items-center space-x-2">
                          <Pill className="h-4 w-4 text-gray-400" />
                          <span>{study.phase}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Target className="h-4 w-4 text-gray-400" />
                          <span>{study.indication}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Users className="h-4 w-4 text-gray-400" />
                          <span>{study.participants} participants</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Globe className="h-4 w-4 text-gray-400" />
                          <span>{study.sites} sites</span>
                        </div>
                      </div>

                      {/* Progress and Sponsor */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center space-x-2">
                            <Building className="h-4 w-4 text-gray-400" />
                            <span className="text-sm text-gray-600">{study.sponsor}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Clock className="h-4 w-4 text-gray-400" />
                            <span className="text-sm text-gray-600">{study.lastActivity}</span>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          <div className="text-right">
                            <p className="text-sm font-medium text-gray-900">{study.completion}% Complete</p>
                            <div className="w-24 bg-gray-200 rounded-full h-2 mt-1">
                              <div
                                className="bg-red-600 h-2 rounded-full transition-all duration-300"
                                style={{ width: `${study.completion}%` }}
                              ></div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center space-x-2 ml-6">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-gray-600 hover:text-gray-900"
                        onClick={(e) => {
                          e.stopPropagation()
                          setSelectedStudy(study.id)
                          setCurrentView("study")
                          if (setEditMode) {
                            setEditMode(true)
                          }
                        }}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-gray-600 hover:text-gray-900"
                        onClick={async (e) => {
                          e.stopPropagation()
                          try {
                            const response = await fetch(`/api/studies/${study.id}/clone`, {
                              method: 'POST',
                            })
                            if (response.ok) {
                              const result = await response.json()
                              alert('Study cloned successfully!')
                              // Refresh the studies list
                              window.location.reload()
                            } else {
                              const errorData = await response.json()
                              alert(`Failed to clone study: ${errorData.error || 'Unknown error'}`)
                            }
                          } catch (error) {
                            alert(`Error cloning study: ${error instanceof Error ? error.message : 'Unknown error'}`)
                          }
                        }}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-gray-600 hover:text-red-600"
                        onClick={async (e) => {
                          e.stopPropagation()
                          if (confirm('Are you sure you want to delete this study? This action cannot be undone.')) {
                            try {
                              const response = await fetch(`/api/studies/${study.id}/delete`, {
                                method: 'DELETE',
                              })
                              if (response.ok) {
                                alert('Study deleted successfully!')
                                // Refresh the studies list
                                window.location.reload()
                              } else {
                                const errorData = await response.json()
                                alert(`Failed to delete study: ${errorData.error || 'Unknown error'}`)
                              }
                            } catch (error) {
                              alert(`Error deleting study: ${error instanceof Error ? error.message : 'Unknown error'}`)
                            }
                          }
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
