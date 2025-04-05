
import React, { useState } from 'react';

function CyberpunkSavingsApp() {
  const [showVillage, setShowVillage] = useState(false);
  const [saved, setSaved] = useState(0);
  const [goal, setGoal] = useState(1000);
  const [goalName, setGoalName] = useState('Pierwszy Cel');
  const [amount, setAmount] = useState('');
  const [resources, setResources] = useState({ wood: 0, stone: 0 });
  const [log, setLog] = useState([]);
  const [xp, setXp] = useState(0);
  const [level, setLevel] = useState(1);
  const [customWeekly, setCustomWeekly] = useState(50);

  const handleSave = () => {
    const num = parseFloat(amount);
    if (!isNaN(num) && num > 0) {
      const newSaved = saved + num;
      const newXp = xp + num;
      const newLevel = Math.floor(newXp / 100) + 1;

      setSaved(newSaved);
      setXp(newXp);
      setLevel(newLevel);
      setResources({
        wood: resources.wood + Math.floor(num * 0.3),
        stone: resources.stone + Math.floor(num * 0.1)
      });
      setLog([...log, { date: new Date().toLocaleDateString(), amount: num }]);
      setAmount('');
    }
  };

  const calcAvg = (period) => {
    const ms = { day: 86400000, week: 604800000, month: 2629800000, year: 31557600000 };
    const now = Date.now();
    const recent = log.filter(entry => now - new Date(entry.date).getTime() < ms[period]);
    const sum = recent.reduce((acc, entry) => acc + entry.amount, 0);
    return (sum / recent.length || 0).toFixed(2);
  };

  const estimateDate = (weeklyAmount) => {
    const remaining = goal - saved;
    if (weeklyAmount <= 0 || remaining <= 0) return 'cel osiągnięty 🎉';
    const weeks = Math.ceil(remaining / weeklyAmount);
    const future = new Date();
    future.setDate(future.getDate() + weeks * 7);
    return future.toLocaleDateString();
  };

  return (
    <div style={{ background: '#000', color: '#0f0', fontFamily: 'monospace', padding: '2rem' }}>
      {!showVillage ? (
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '3rem' }}>😊</div>
          <button onClick={() => setShowVillage(true)} style={{ fontSize: '2rem', marginTop: '1rem' }}>🔍</button>
          <button onClick={() => alert('Dziennik')} style={{ fontSize: '2rem', margin: '1rem' }}>📜</button>
          <button onClick={() => alert('Osiągnięcia')} style={{ fontSize: '2rem' }}>🏆</button>
        </div>
      ) : (
        <>
          <h1>{goalName}</h1>
          <div style={{ marginBottom: '1rem' }}>
            <label>🎯 Nazwa celu: </label>
            <input value={goalName} onChange={e => setGoalName(e.target.value)} />
          </div>
          <div style={{ marginBottom: '1rem' }}>
            <label>🎯 Kwota celu: </label>
            <input type="number" value={goal} onChange={e => setGoal(parseFloat(e.target.value))} />
          </div>

          <div style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>
            Poziom: {level} | XP: {xp.toFixed(1)}
          </div>

          <progress value={saved} max={goal} style={{ width: '100%' }}></progress>

          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1rem' }}>
            <div>
              <div>Średnio dziennie: {calcAvg('day')} €</div>
              <div>Średnio tygodniowo: {calcAvg('week')} €</div>
              <div>Średnio miesięcznie: {calcAvg('month')} €</div>
              <div>Średnio rocznie: {calcAvg('year')} €</div>
              <div>Cel osiągniesz do: {estimateDate(calcAvg('week'))}</div>
              <div>
                Jeśli zwiększysz tygodniowo do:
                <input type="number" value={customWeekly} onChange={e => setCustomWeekly(e.target.value)} style={{ width: '60px', margin: '0 0.5rem' }} />€
                to cel osiągniesz do: {estimateDate(customWeekly)}
              </div>
            </div>
            <div>
              <div>💰 Zaoszczędzono: {saved} €</div>
              <div>🌲 Drewno: {resources.wood}</div>
              <div>🪨 Kamień: {resources.stone}</div>
            </div>
          </div>

          <div style={{ marginTop: '2rem' }}>
            <input type="number" value={amount} onChange={e => setAmount(e.target.value)} placeholder="Ile oszczędzasz?" />
            <button onClick={handleSave} style={{ marginLeft: '1rem' }}>💾 Zapisz</button>
            <button onClick={() => setShowVillage(false)} style={{ marginLeft: '1rem' }}>↩️ Wróć</button>
          </div>
        </>
      )}
    </div>
  );
}

export default CyberpunkSavingsApp;
