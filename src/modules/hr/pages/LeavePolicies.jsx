export default function LeavePolicies() {
  return (
    <section className="max-w-4xl mx-auto py-10 px-6 bg-white shadow-sm rounded-xl border border-ink-100">
      <div className="border-b border-ink-100 pb-8 mb-8">
        <h1 className="text-4xl font-bold text-ink-900 mb-2">Leave Policy</h1>
        <p className="text-ink-500 font-medium">Official organisation guidelines for leave management and entitlements.</p>
      </div>

      <div className="space-y-12 text-ink-800">
        {/* Section 1 */}
        <section>
          <h1 className="text-lg font-bold text-ink-900 mb-3">MAKE CHANGES AS PER THE REQUIREMENT</h1>
          <h2 className="text-2xl font-bold text-ink-900 mb-6 pb-2 border-b-2 border-brand-500 inline-block">1. Annual Leave Entitlement</h2>

          <div className="space-y-8 mt-4">
            <div>

              <h3 className="text-lg font-bold text-ink-900 mb-3">1.1 Employees</h3>
              <ul className="list-disc pl-6 space-y-3">
                <li><strong className="text-brand-600">Casual Leave (CL): 6 days/year</strong>
                  <p className="mt-1 text-sm text-ink-600">Casual Leave is provided for personal needs such as family matters, personal work, or short breaks. These leaves are meant for short-term usage and should be planned in advance whenever possible.</p>
                </li>
                <li><strong className="text-brand-600">Sick Leave (SL): 6 days/year</strong>
                  <p className="mt-1 text-sm text-ink-600">Sick Leave is granted when an employee is unwell or unable to work due to health issues. It can be used for minor illnesses or medical recovery.</p>
                </li>
                <li><strong className="text-ink-900">Total Paid Leave: 12 days/year</strong>
                  <p className="mt-1 text-sm text-ink-600">Employees are entitled to a total of 12 paid leave days per year combining Casual and Sick Leave.</p>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-bold text-ink-900 mb-3">1.2 Managers</h3>
              <ul className="list-disc pl-6 space-y-3">
                <li><strong className="text-brand-600">Casual Leave (CL): 6 days/year</strong></li>
                <li><strong className="text-brand-600">Sick Leave (SL): 6 days/year</strong></li>
                <li><strong className="text-ink-900">Total Paid Leave: 12 days/year</strong>
                  <p className="mt-1 text-sm text-ink-600">Managers receive the same total leave allocation as employees to maintain policy consistency.</p>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-bold text-ink-900 mb-3">1.3 HR Team</h3>
              <ul className="list-disc pl-6 space-y-3">
                <li><strong className="text-brand-600">Casual Leave (CL): 6 days/year</strong></li>
                <li><strong className="text-brand-600">Sick Leave (SL): 6 days/year</strong></li>
                <li><strong className="text-ink-900">Total Paid Leave: 12 days/year</strong></li>
              </ul>
            </div>
          </div>
        </section>

        {/* Section 2 */}
        <section>
          <h2 className="text-2xl font-bold text-ink-900 mb-4 pb-2 border-b-2 border-brand-500 inline-block">2. Special Leaves (Applicable to All Roles)</h2>
          <ul className="list-disc pl-6 space-y-4">
            <li><strong className="text-ink-900">Maternity Leave: 26 weeks</strong>
              <p className="mt-1 text-sm text-ink-600">Female employees are entitled to maternity leave for childbirth and recovery. This leave helps ensure proper care for both mother and child.</p>
            </li>
            <li><strong className="text-ink-900">Paternity Leave: 5 days</strong>
              <p className="mt-1 text-sm text-ink-600">Male employees can take paternity leave during or after the birth of their child. This allows them to support their family during an important time.</p>
            </li>
            <li><strong className="text-ink-900">Bereavement Leave: 3 days</strong>
              <p className="mt-1 text-sm text-ink-600">This leave is granted in case of the death of an immediate family member. It allows employees time to grieve and manage personal responsibilities.</p>
            </li>
            <li><strong className="text-ink-900">Marriage Leave: 5 days</strong>
              <p className="mt-1 text-sm text-ink-600">Employees can take leave for their own marriage. This helps them manage ceremonies and personal commitments.</p>
            </li>
          </ul>
        </section>

        {/* Section 3 */}
        <section>
          <h2 className="text-2xl font-bold text-ink-900 mb-4 pb-2 border-b-2 border-brand-500 inline-block">3. Compensatory Off (Comp Off)</h2>
          <ul className="list-disc pl-6 space-y-3">
            <li><strong className="text-ink-900">1 day leave for working on weekends/holidays</strong>
              <p className="mt-1 text-sm text-ink-600">If an employee works on a declared holiday or weekend, they are eligible for a compensatory off.</p>
            </li>
            <li><strong className="text-ink-900">Must be used within 30 days</strong>
              <p className="mt-1 text-sm text-ink-600">Comp Off should be utilized within 30 days from the date it is earned. If not used within this period, it will expire.</p>
            </li>
          </ul>
        </section>

        {/* Section 4 */}
        <section>
          <h2 className="text-2xl font-bold text-ink-900 mb-4 pb-2 border-b-2 border-brand-500 inline-block">4. Loss of Pay (LOP)</h2>
          <ul className="list-disc pl-6 space-y-3">
            <li><strong className="text-ink-900">Applicable when leave balance is exhausted</strong>
              <p className="mt-1 text-sm text-ink-600">If an employee has used all their available leaves, any additional leave taken will be treated as Loss of Pay.</p>
            </li>
            <li><strong className="text-ink-900">Salary deduction for extra leave days</strong>
              <p className="mt-1 text-sm text-ink-600">For each extra day of leave taken beyond the balance, a corresponding salary deduction will be applied.</p>
            </li>
          </ul>
        </section>

        {/* Section 5 */}
        <section>
          <h2 className="text-2xl font-bold text-ink-900 mb-4 pb-2 border-b-2 border-brand-500 inline-block">5. Carry Forward Policy</h2>
          <ul className="list-disc pl-6 space-y-3">
            <li><strong className="text-ink-900">No carry forward allowed</strong>
              <p className="mt-1 text-sm text-ink-600">Unused Casual Leave and Sick Leave cannot be carried forward to the next year.</p>
            </li>
            <li><strong className="text-ink-900">Leaves expire at year end</strong>
              <p className="mt-1 text-sm text-ink-600">All unused leave balances will lapse at the end of the calendar year. Employees are encouraged to utilize their leaves within the year.</p>
            </li>
          </ul>
        </section>

        {/* Section 6 */}
        <section>
          <h2 className="text-2xl font-bold text-ink-900 mb-4 pb-2 border-b-2 border-brand-500 inline-block">6. Leave Accrual</h2>
          <ul className="list-disc pl-6 space-y-3">
            <li><strong className="text-ink-900">Leaves are credited yearly</strong>
              <p className="mt-1 text-sm text-ink-600">The total 12 leaves (6 CL + 6 SL) are allocated at the beginning of the year.</p>
            </li>
            <li><strong className="text-ink-900">No monthly accrual system</strong>
              <p className="mt-1 text-sm text-ink-600">Leaves are not accumulated monthly; instead, the full allocation is provided upfront.</p>
            </li>
          </ul>
        </section>

        {/* Section 7 */}
        <section>
          <h2 className="text-2xl font-bold text-ink-900 mb-4 pb-2 border-b-2 border-brand-500 inline-block">7. Leave Limits per Request</h2>
          <div className="space-y-6 mt-4">
            <div>
              <h3 className="text-lg font-bold text-ink-900 mb-2">7.1 Casual Leave</h3>
              <ul className="list-disc pl-6">
                <li><strong className="text-ink-900">Maximum 3 days at a time</strong></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-bold text-ink-900 mb-2">7.2 Sick Leave</h3>
              <ul className="list-disc pl-6">
                <li><strong className="text-ink-900">Medical proof required if more than 2 days</strong></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-bold text-ink-900 mb-2">7.3 Paid Leave</h3>
              <ul className="list-disc pl-6">
                <li><strong className="text-ink-900">Minimum 5 days advance notice required</strong></li>
                <li><strong className="text-ink-900">Can be combined with CL/SL if approved</strong></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-bold text-ink-900 mb-2">7.4 WFH (Work From Home)</h3>
              <ul className="list-disc pl-6">
                <li><strong className="text-ink-900">Available for technical or personal emergencies</strong></li>
                <li><strong className="text-ink-900">Prior approval from Manager required</strong></li>
              </ul>
            </div>
          </div>
        </section>

        {/* Section 8 */}
        <section>
          <h2 className="text-2xl font-bold text-ink-900 mb-4 pb-2 border-b-2 border-brand-500 inline-block">8. Leave Application Rules</h2>
          <ul className="list-disc pl-6 space-y-3">
            <li><strong className="text-ink-900">Planned leave must be applied in advance (minimum 2 days)</strong></li>
            <li><strong className="text-ink-900">Emergency leave must be informed immediately</strong></li>
          </ul>
        </section>

        {/* Section 9 */}
        <section>
          <h2 className="text-2xl font-bold text-ink-900 mb-4 pb-2 border-b-2 border-brand-500 inline-block">9. Holiday & Weekend Policy</h2>
          <ul className="list-disc pl-6 space-y-3">
            <li><strong className="text-ink-900">Weekends are not counted as leave</strong></li>
            <li><strong className="text-ink-900">Sandwich Rule applies</strong>
              <p className="mt-1 text-sm text-ink-600">If an employee takes leave before and after a weekend or holiday, those days may be counted as leave.</p>
            </li>
          </ul>
        </section>

        {/* Section 10 */}
        <section className="bg-ink-50 p-8 rounded-2xl border border-ink-100">
          <h2 className="text-2xl font-bold text-ink-900 mb-4">10. Probation Policy</h2>
          <ul className="list-disc pl-6 space-y-3">
            <li className="text-ink-700">Applicable during first 3–6 months.</li>
            <li><strong className="text-ink-900">Only Sick Leave allowed.</strong></li>
            <li><strong className="text-ink-900">Casual Leave not allowed.</strong></li>
            <li><strong className="text-ink-900">Extra leave treated as Loss of Pay (LOP).</strong></li>
          </ul>
        </section>
      </div>

      <div className="mt-16 text-center text-xs text-ink-400 border-t border-ink-100 pt-8">
        © 2024 LMS Portal • Corporate Human Resources Policy
      </div>
    </section>
  )
}
