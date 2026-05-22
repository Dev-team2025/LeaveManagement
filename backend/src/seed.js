import 'dotenv/config'
import bcrypt from 'bcryptjs'
import { connectToDatabase } from './db.js'
import { User } from './models/User.js'
import { LeaveType } from './models/LeaveType.js'
import { Settings } from './models/Settings.js'
import { Holiday } from './models/Holiday.js'

const DEMO_PASSWORD = 'Password@123'

async function upsertUser({ email, name, role, baseSalary = 50000 }) {
  const passwordHash = await bcrypt.hash(DEMO_PASSWORD, 10)
  await User.updateOne(
    { email },
    {
      $set: {
        email,
        name,
        role,
        passwordHash,
        isActive: true,
        baseSalary,
      },
    },
    { upsert: true },
  )
}

async function main() {
  await connectToDatabase(process.env.MONGODB_URI)

  const passwordHash = await bcrypt.hash(DEMO_PASSWORD, 10)

  // 1. Create Manager first
  const manager = await User.findOneAndUpdate(
    { email: 'manager@demo.local' },
    {
      $set: {
        email: 'manager@demo.local',
        name: 'Manager',
        role: 'manager',
        passwordHash,
        isActive: true,
        department: 'Engineering',
        designation: 'Engineering Manager',
        baseSalary: 80000,
      },
    },
    { upsert: true, new: true },
  )

  // 2. Create Employee and link to Manager
  await User.findOneAndUpdate(
    { email: 'employee@demo.local' },
    {
      $set: {
        email: 'employee@demo.local',
        name: 'Employee',
        role: 'employee',
        passwordHash,
        isActive: true,
        department: 'Engineering',
        designation: 'Software Engineer',
        managerId: manager._id,
        baseSalary: 45000,
      },
    },
    { upsert: true },
  )

  // 3. Create HR and Admin
  await upsertUser({ email: 'hr@demo.local', name: 'HR', role: 'hr' })
  await upsertUser({ email: 'admin@demo.local', name: 'Admin', role: 'admin' })

  // 4. Update existing leave requests to link to manager if they exist
  // (In case the user already created some)
  const emp = await User.findOne({ email: 'employee@demo.local' })
  if (emp && manager) {
    const { LeaveRequest } = await import('./models/LeaveRequest.js')
    await LeaveRequest.updateMany(
      { userId: emp._id, managerId: null },
      { $set: { managerId: manager._id } }
    )
  }

  await LeaveType.deleteOne({ code: 'ANNUAL' })

  await LeaveType.updateOne(
    { code: 'SICK' },
    { $set: { name: 'Sick Leave', code: 'SICK', maxDaysPerYear: 6, isWFH: false, isActive: true } },
    { upsert: true },
  )
  await LeaveType.updateOne(
    { code: 'CASUAL' },
    { $set: { name: 'Casual Leave', code: 'CASUAL', maxDaysPerYear: 6, isWFH: false, isActive: true } },
    { upsert: true },
  )
  await LeaveType.updateOne(
    { code: 'WFH' },
    {
      $set: { name: 'Work From Home', code: 'WFH', maxDaysPerYear: 365, isWFH: true, isActive: true },
    },
    { upsert: true },
  )

  await Settings.updateOne(
    { key: 'default' },
    {
      $set: {
        key: 'default',
        wfhEmergencyOnly: true,
        wfhRestrictedDuringSemester: true,
        semesterPeriods: [
          { start: new Date('2026-01-01T00:00:00.000Z'), end: new Date('2026-05-31T23:59:59.999Z') },
          { start: new Date('2026-07-01T00:00:00.000Z'), end: new Date('2026-11-30T23:59:59.999Z') },
        ],
      },
    },
    { upsert: true },
  )

  const HOLIDAYS = [
    { name: 'Republic Day', date: '2026-01-26', type: 'national', description: 'National holiday' },
    { name: 'Holi', date: '2026-03-14', type: 'festival', description: 'Festival of colours' },
    { name: 'Good Friday', date: '2026-04-03', type: 'national', description: 'National holiday' },
    { name: 'Eid ul-Fitr', date: '2026-04-01', type: 'festival', description: 'Festival holiday' },
    { name: 'Dr. Ambedkar Jayanti', date: '2026-04-14', type: 'national', description: 'National holiday' },
    { name: 'Independence Day', date: '2026-08-15', type: 'national', description: 'National holiday' },
    { name: 'Gandhi Jayanti', date: '2026-10-02', type: 'national', description: 'National holiday' },
    { name: 'Diwali', date: '2026-10-20', type: 'festival', description: 'Festival of lights' },
    { name: 'Diwali (Laxmi Puja)', date: '2026-10-21', type: 'festival', description: 'Festival holiday' },
    { name: 'Christmas', date: '2026-12-25', type: 'national', description: 'National holiday' },
    { name: "New Year's Day", date: '2026-01-01', type: 'national', description: 'National holiday' },
    { name: 'Ganesh Chaturthi', date: '2026-08-25', type: 'festival', description: 'Festival holiday' },
  ]

  for (const h of HOLIDAYS) {
    await Holiday.updateOne(
      { date: new Date(h.date) },
      { $set: { ...h, date: new Date(h.date), isActive: true } },
      { upsert: true },
    )
  }

  console.log('Seeded demo data successfully. Password:', DEMO_PASSWORD)
  process.exit(0)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})

