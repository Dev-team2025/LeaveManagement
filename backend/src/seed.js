import 'dotenv/config'
import bcrypt from 'bcryptjs'
import { connectToDatabase } from './db.js'
import { User } from './models/User.js'
import { LeaveType } from './models/LeaveType.js'
import { Settings } from './models/Settings.js'

const DEMO_PASSWORD = 'Password@123'

async function upsertUser({ email, name, role }) {
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

  await LeaveType.updateOne(
    { code: 'ANNUAL' },
    { $set: { name: 'Annual Leave', code: 'ANNUAL', maxDaysPerYear: 18, isWFH: false, isActive: true } },
    { upsert: true },
  )
  await LeaveType.updateOne(
    { code: 'SICK' },
    { $set: { name: 'Sick Leave', code: 'SICK', maxDaysPerYear: 10, isWFH: false, isActive: true } },
    { upsert: true },
  )
  await LeaveType.updateOne(
    { code: 'CASUAL' },
    { $set: { name: 'Casual Leave', code: 'CASUAL', maxDaysPerYear: 7, isWFH: false, isActive: true } },
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

  console.log('Seeded demo data successfully. Password:', DEMO_PASSWORD)
  process.exit(0)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})

