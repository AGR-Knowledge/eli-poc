export const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  })
}

export const getStatusColor = (status: string) => {
  switch (status) {
    case "ACTIVE":
      return "bg-emerald-100 text-emerald-800 border-emerald-200"
    case "RECRUITING":
      return "bg-blue-100 text-blue-800 border-blue-200"
    case "PLANNING":
      return "bg-amber-100 text-amber-800 border-amber-200"
    case "COMPLETED":
      return "bg-gray-100 text-gray-800 border-gray-200"
    case "SUSPENDED":
      return "bg-red-100 text-red-800 border-red-200"
    default:
      return "bg-gray-100 text-gray-800 border-gray-200"
  }
}

export const getProcessingStatusColor = (status: string) => {
  switch (status) {
    case "COMPLETED":
      return "bg-emerald-100 text-emerald-800 border-emerald-200"
    case "PROCESSING":
      return "bg-amber-100 text-amber-800 border-amber-200"
    case "FAILED":
      return "bg-red-100 text-red-800 border-red-200"
    default:
      return "bg-gray-100 text-gray-800 border-gray-200"
  }
}

export const getPriorityColor = (priority: string) => {
  switch (priority) {
    case "HIGH":
      return "bg-red-100 text-red-800 border-red-200"
    case "MEDIUM":
      return "bg-amber-100 text-amber-800 border-amber-200"
    case "LOW":
      return "bg-gray-100 text-gray-800 border-gray-200"
    default:
      return "bg-gray-100 text-gray-800 border-gray-200"
  }
}
