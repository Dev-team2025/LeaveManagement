import { useEffect, useState } from 'react'
import Button from '@/modules/employee/components/Button'
import employeeService from '@/modules/employee/services/employeeService'

const initialValues = {
  leaveType: '',
  fromDate: '',
  toDate: '',
  reason: '',
  medicalDocument: null,
}

function LeaveForm() {
  const [values, setValues] = useState(initialValues)
  const [errors, setErrors] = useState({})
  const [leaveTypes, setLeaveTypes] = useState([])
  const [successMessage, setSuccessMessage] = useState('')

  useEffect(() => {
    const loadLeaveTypes = async () => {
      const response = await employeeService.getLeaveTypes()
      setLeaveTypes(response)
      setValues((current) => ({ ...current, leaveType: response[0] || current.leaveType }))
    }

    loadLeaveTypes()
  }, [])

  const handleChange = (event) => {
    const { name, value } = event.target
    setValues((current) => ({ ...current, [name]: value }))
    setErrors((current) => ({ ...current, [name]: '' }))
  }

  const handleFileChange = (event) => {
    const file = event.target.files?.[0] || null
    setValues((current) => ({ ...current, medicalDocument: file }))
  }

  const validate = () => {
    const nextErrors = {}

    if (!values.leaveType) nextErrors.leaveType = 'Select a leave type.'
    if (!values.fromDate) nextErrors.fromDate = 'Choose a start date.'
    if (!values.toDate) nextErrors.toDate = 'Choose an end date.'
    if (values.fromDate && values.toDate && values.fromDate > values.toDate) {
      nextErrors.toDate = 'End date must be after start date.'
    }
    if (!values.reason.trim()) nextErrors.reason = 'Add a short reason for your request.'

    setErrors(nextErrors)
    return Object.keys(nextErrors).length === 0
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    if (!validate()) {
      setSuccessMessage('')
      return
    }

    const response = await employeeService.submitLeave(values)
    setSuccessMessage(response.message)
    setValues((current) => ({
      ...initialValues,
      leaveType: leaveTypes[0] || current.leaveType,
    }))
    setErrors({})
  }

  const handleCancel = () => {
    setValues({
      ...initialValues,
      leaveType: leaveTypes[0] || '',
    })
    setErrors({})
    setSuccessMessage('')
  }

  const requestedDays =
    values.fromDate && values.toDate && values.fromDate <= values.toDate
      ? Math.floor((new Date(values.toDate) - new Date(values.fromDate)) / (1000 * 60 * 60 * 24)) + 1
      : 0

  return (
    <form className="rounded-[28px] border border-ink-100 bg-white p-6 shadow-panel lg:p-8" onSubmit={handleSubmit}>
      <h3 className="font-display text-2xl font-semibold text-ink-900">Leave Details</h3>

      <div className="mt-6 space-y-5">
        <label className="flex flex-col gap-2 text-sm">
          <span className="font-semibold text-ink-900">
            Leave Type <span className="text-danger-500">*</span>
          </span>
          <select
            name="leaveType"
            value={values.leaveType}
            onChange={handleChange}
            className={`h-12 rounded-2xl border border-ink-200 bg-ink-50 px-4 text-ink-900 outline-none transition focus:border-brand-500 focus:ring-4 focus:ring-brand-100 ${
              errors.leaveType ? 'border-danger-500 focus:ring-red-100' : ''
            }`}
          >
            {leaveTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
          {errors.leaveType ? <span className="text-xs font-medium text-danger-500">{errors.leaveType}</span> : null}
        </label>

        <div className="grid gap-5 md:grid-cols-2">
          <label className="flex flex-col gap-2 text-sm">
            <span className="font-semibold text-ink-900">
              Start Date <span className="text-danger-500">*</span>
            </span>
            <input
              type="date"
              name="fromDate"
              value={values.fromDate}
              onChange={handleChange}
              className={`h-12 rounded-2xl border border-ink-200 bg-ink-50 px-4 text-ink-900 outline-none transition focus:border-brand-500 focus:ring-4 focus:ring-brand-100 ${
                errors.fromDate ? 'border-danger-500 focus:ring-red-100' : ''
              }`}
            />
            {errors.fromDate ? <span className="text-xs font-medium text-danger-500">{errors.fromDate}</span> : null}
          </label>

          <label className="flex flex-col gap-2 text-sm">
            <span className="font-semibold text-ink-900">
              End Date <span className="text-danger-500">*</span>
            </span>
            <input
              type="date"
              name="toDate"
              value={values.toDate}
              onChange={handleChange}
              className={`h-12 rounded-2xl border border-ink-200 bg-ink-50 px-4 text-ink-900 outline-none transition focus:border-brand-500 focus:ring-4 focus:ring-brand-100 ${
                errors.toDate ? 'border-danger-500 focus:ring-red-100' : ''
              }`}
            />
            {errors.toDate ? <span className="text-xs font-medium text-danger-500">{errors.toDate}</span> : null}
          </label>
        </div>

        <div className="rounded-2xl bg-brand-50 px-4 py-4">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-ink-700">Total Days Requested</p>
            <p className="font-display text-3xl font-semibold text-brand-600">
              {requestedDays} {requestedDays === 1 ? 'day' : 'days'}
            </p>
          </div>
        </div>

        <label className="flex flex-col gap-2 text-sm">
          <span className="font-semibold text-ink-900">
            Reason for Leave <span className="text-danger-500">*</span>
          </span>
          <textarea
            name="reason"
            rows={5}
            value={values.reason}
            onChange={handleChange}
            placeholder="Please provide a detailed reason for your leave request..."
            className={`rounded-2xl border border-ink-200 bg-ink-50 px-4 py-3 text-ink-900 outline-none transition placeholder:text-ink-400 focus:border-brand-500 focus:ring-4 focus:ring-brand-100 ${
              errors.reason ? 'border-danger-500 focus:ring-red-100' : ''
            }`}
          />
          {errors.reason ? <span className="text-xs font-medium text-danger-500">{errors.reason}</span> : null}
        </label>

        <label className="flex flex-col gap-2 text-sm">
          <span className="font-semibold text-ink-900">Attachment (Medical Document)</span>
          <div className="rounded-2xl border border-dashed border-ink-300 bg-ink-50 px-4 py-6 text-center">
            <input
              type="file"
              name="medicalDocument"
              accept=".pdf,.jpg,.jpeg,.png"
              onChange={handleFileChange}
              className="mx-auto block w-full max-w-xs text-sm text-ink-600 file:mr-4 file:rounded-xl file:border-0 file:bg-brand-600 file:px-3 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-brand-700"
            />
            <p className="mt-3 text-xs text-ink-500">PDF, JPG, JPEG, PNG up to 5MB</p>
            {values.medicalDocument ? (
              <p className="mt-2 text-xs font-medium text-ink-700">{values.medicalDocument.name}</p>
            ) : null}
          </div>
        </label>

        <div className="rounded-2xl border-l-4 border-warning-500 bg-amber-50 px-4 py-3">
          <p className="text-base font-semibold text-ink-900">Potential Conflict Detected</p>
          <p className="mt-1 text-sm text-ink-600">
            The selected period may require additional approval based on department leave load.
          </p>
        </div>
      </div>

      <div className="mt-7 flex flex-col gap-3 border-t border-ink-100 pt-5 sm:flex-row sm:items-center sm:justify-between">
        <Button type="button" variant="ghost" className="bg-ink-100 text-ink-600 hover:bg-ink-200" onClick={handleCancel}>
          Cancel
        </Button>
        <Button type="submit" className="sm:min-w-56">
          Submit Leave Request
        </Button>
      </div>

      {successMessage ? (
        <div className="mt-4 rounded-2xl bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">
          {successMessage}
        </div>
      ) : null}
    </form>
  )
}

export default LeaveForm
