/* frontend/src/pages/Growth.tsx */
export default function Growth() {
  return (
    <div className="p-8 animate-fade-in text-gray-900 dark:text-gray-100">
      <header className="mb-6">
        <h1 className="text-2xl font-bold font-['Montserrat']">Growth & Goals</h1>
      </header>
      
      <div className="glass-card">
        <h3 className="font-bold mb-6">OKRs (Objectives and Key Results)</h3>
        <div className="space-y-8">
          {[
            { label: "Reach $2M ARR", val: "78%", color: "bg-emerald-500" },
            { label: "Hire 5 Senior Engineers", val: "40%", color: "bg-blue-500" },
            { label: "Reduce Churn < 2%", val: "92%", color: "bg-purple-500" }
          ].map((goal, i) => (
             <div key={i}>
                <div className="flex justify-between text-sm mb-2 font-medium">
                    <span>{goal.label}</span>
                    <span>{goal.val}</span>
                </div>
                <div className="w-full bg-gray-500/10 rounded-full h-3 overflow-hidden">
                    <div className={`${goal.color} h-3 rounded-full transition-all duration-1000`} style={{ width: goal.val }}></div>
                </div>
             </div>
          ))}
        </div>
      </div>
    </div>
  );
}