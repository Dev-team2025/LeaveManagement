import { useEffect, useState, useMemo } from 'react'
import Button from '@/modules/employee/components/Button'
import InputField from '@/modules/employee/components/InputField'
import employeeService from '@/modules/employee/services/employeeService'

const initialValues = {
  leaveType: 'Casual Leave',
  fromDate: '',
  toDate: '',
  reason: '',
}

function LeaveForm() {
  const [values, setValues] = useState(initialValues)
  const [errors, setErrors] = useState({})
  const [leaveTypes, setLeaveTypes] = useState([])
  const [successMessage, setSuccessMessage] = useState('')

  useEffect(() => {
    const loadLeaveTypes = async () => {
      const response = await employeeService.getLeaveTypes()
      setLeaveTypes(response.length > 0 ? response : ['Casual Leave', 'Sick Leave', 'Earned Leave'])
      setValues((current) => ({ ...current, leaveType: response[0] || 'Casual Leave' }))
    }

    loadLeaveTypes()
  }, [])

  const handleChange = (event) => {
    const { name, value } = event.target
    setValues((current) => ({ ...current, [name]: value }))
    setErrors((current) => ({ ...current, [name]: '' }))
  }

  const daysRequested = useMemo(() => {
    if (!values.fromDate || !values.toDate) return 0
    const start = new Date(values.fromDate)
    const end = new Date(values.toDate)
    const diffTime = Math.abs(end - start)
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1
    return diffDays > 0 ? diffDays : 0
  }, [values.fromDate, values.toDate])

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

  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
      {/* Left Column: Form and Details */}
      <div className="lg:col-span-2 space-y-6">
        <form className="rounded-[32px] border border-ink-100 bg-white p-6 shadow-panel lg:p-8" onSubmit={handleSubmit}>
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-ink-900">Leave Details</h3>
            
            <div className="grid gap-5 md:grid-cols-2">
              <InputField
                as="select"
                label="Leave Type *"
                name="leaveType"
                value={values.leaveType}
                onChange={handleChange}
                options={leaveTypes}
                error={errors.leaveType}
              />
              <div className="hidden md:block" />
              
              <InputField
                label="Start Date *"
                name="fromDate"
                type="date"
                value={values.fromDate}
                onChange={handleChange}
                error={errors.fromDate}
              />
              <InputField
                label="End Date *"
                name="toDate"
                type="date"
                value={values.toDate}
                onChange={handleChange}
                error={errors.toDate}
              />
            </div>

            {/* Total Days Requested Box */}
            <div className="flex items-center justify-between rounded-2xl bg-brand-50 p-6">
              <span className="text-sm font-medium text-ink-700">Total Days Requested</span>
              <span className="text-3xl font-semibold text-brand-600">{daysRequested} days</span>
            </div>

            <InputField
              as="textarea"
              label="Reason for Leave *"
              name="reason"
              rows="4"
              value={values.reason}
              onChange={handleChange}
              placeholder="Please provide a detailed reason for your leave request..."
              error={errors.reason}
            />

            {/* Attachment Section */}
            <div className="space-y-2">
              <span className="text-sm font-medium text-ink-900">Attachment (Optional)</span>
              <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-ink-200 bg-ink-25 p-10 transition hover:border-brand-300">
                <svg className="h-10 w-10 text-ink-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v16m8-8H4" />
                </svg>
                <p className="mt-4 text-sm font-medium text-ink-900">Click to upload or drag and drop</p>
                <p className="mt-1 text-xs text-ink-500">PDF, JPG, PNG up to 5MB (Medical certificate, documents)</p>
              </div>
            </div>

            {/* Potential Conflict Alert */}
            <div className="flex gap-4 rounded-2xl border border-orange-200 bg-orange-50 p-4">
              <div className="mt-0.5 shrink-0 text-orange-600">
                <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-orange-900">Potential Conflict Detected</h4>
                <p className="mt-1 text-sm text-orange-800">
                  The Computer Science department has high leave requests for this period. Your request may require additional approval time.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 pt-4">
              <button type="button" className="flex-1 rounded-2xl border border-ink-200 bg-ink-50 px-6 py-4 text-sm font-semibold text-ink-900 transition hover:bg-ink-100">
                Cancel
              </button>
              <button type="submit" className="flex-[2] flex items-center justify-center gap-2 rounded-2xl bg-brand-600 px-6 py-4 text-sm font-semibold text-white transition hover:bg-brand-700 shadow-lg shadow-brand-200">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
                Submit Leave Request
              </button>
            </div>
          </div>

          {successMessage ? (
            <div className="mt-4 rounded-2xl bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">
              {successMessage}
            </div>
          ) : null}
        </form>
      </div>

      {/* Right Column: Information Cards */}
      <div className="space-y-6">
        {/* Current Balance Card */}
        <div className="rounded-[32px] border border-ink-100 bg-white p-6 shadow-panel">
          <h3 className="text-lg font-semibold text-ink-900">Current Balance</h3>
          <div className="mt-6 space-y-4">
            <div className="flex items-end justify-between">
              <span className="text-sm text-ink-500">Available</span>
              <span className="text-2xl font-bold text-ink-900">5 days</span>
            </div>
            {/* Progress Bar */}
            <div className="h-2 w-full rounded-full bg-ink-100">
              <div className="h-2 w-1/2 rounded-full bg-emerald-500" />
            </div>
            <div className="space-y-2 pt-2">
              <div className="flex justify-between text-sm">
                <span className="text-ink-500">Total Allocation</span>
                <span className="font-medium text-ink-900">10 days</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-ink-500">Already Used</span>
                <span className="font-medium text-ink-900">5 days</span>
              </div>
            </div>
          </div>
        </div>

        {/* After This Request Card */}
        <div className="rounded-[32px] border border-ink-100 bg-white p-6 shadow-panel">
          <h3 className="text-lg font-semibold text-ink-900">After This Request</h3>
          <div className="mt-6 space-y-4">
            <div className="flex items-center justify-between rounded-2xl bg-ink-25 p-4">
              <span className="text-sm text-ink-500">Days Requested</span>
              <span className="text-2xl font-bold text-brand-600">{daysRequested}</span>
            </div>
            <div className="flex items-center justify-between rounded-2xl bg-ink-25 p-4">
              <span className="text-sm text-ink-500">Remaining Balance</span>
              <span className="text-2xl font-bold text-ink-900">{5 - daysRequested}</span>
            </div>
          </div>
        </div>

        {/* Important Notes Card */}
        <div className="rounded-[32px] bg-brand-50 p-6">
          <div className="flex items-center gap-3">
            <div className="shrink-0 text-brand-600">
              <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </div>
            <h3 className="font-semibold text-brand-900">Important Notes</h3>
          </div>
          <ul className="mt-4 space-y-2 text-sm text-brand-800">
            <li className="flex gap-2">
              <span className="text-brand-400">•</span>
              <span>Leave requests require approval</span>
            </li>
            <li className="flex gap-2">
              <span className="text-brand-400">•</span>
              <span>Apply at least 3 days in advance</span>
            </li>
            <li className="flex gap-2">
              <span className="text-brand-400">•</span>
              <span>Emergency leaves need valid proof</span>
            </li>
            <li className="flex gap-2">
              <span className="text-brand-400">•</span>
              <span>Check department availability</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default LeaveForm
