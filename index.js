import React, { useState } from 'react';

export default function ExamGrader() {
  const [variant, setVariant] = useState('1');
  const [fileName, setFileName] = useState('');
  const [textData, setTextData] = useState('');
  const [results, setResults] = useState([]);
  const [metrics, setMetrics] = useState(null);
  const [error, setError] = useState('');

  // 🗂️ Answer Keys Registry
  const ANSWER_KEYS = {
    "1": "CDBDD BBDCB BDBCD AAACA CBBCB AACAB CACBA CCDBC BDBDB AAABB CCBBB BBCBC".replace(/\s/g, ""),
    "2": "".replace(/\s/g, ""), // Paste Variant 2 here
    "3": "".replace(/\s/g, "")  // Paste Variant 3 here
  };

  // ⚙️ Frontend Grading Engine
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setFileName(file.name);

    const reader = new FileReader();
    reader.onload = (event) => {
      setTextData(event.target.result);
      setError('');
    };
    reader.readAsText(file);
  };

  const processGrading = () => {
    if (!textData) {
      setError('Please upload a student layout .txt file first.');
      return;
    }

    const key = ANSWER_KEYS[variant];
    if (!key) {
      setError(`Answer key for Variant ${variant} is missing!`);
      return;
    }

    const lines = textData.split('\n');
    const gradedRows = [];

    lines.forEach((line) => {
      if (!line.trim() || line.startsWith('|| " ";
        const correctAns = key[i];
        const isMath = i < 50;

        if ([" ", "?", ""].includes(studentAns)) {
          if (isMath) mathBlank++; else readBlank++;
        } else if (studentAns === correctAns) {
          if (isMath) { mathCorrect++; mathScore += 4; } 
          else { readCorrect++; readScore += 4; }
        } else {
          if (isMath) { mathWrong++; mathScore -= 1; } 
          else { readWrong++; readScore -= 1; }
        }
      }

      gradedRows.push({
        studentId,
        fullName: `${lastName} ${firstName}`,
        variant: studentVariant,
        mathCorrect, mathWrong, mathBlank, mathScore,
        readCorrect, readWrong, readBlank, readScore,
        totalScore: mathScore + readScore
      });
    });

    if (gradedRows.length === 0) {
      setError(`No student records found matching Variant ${variant} in this file.`);
      setResults([]);
      setMetrics(null);
      return;
    }

    // Calculate Dashboard Summary Metrics
    const scores = gradedRows.map(r => r.totalScore);
    const maxScore = Math.max(...scores);
    const minScore = Math.min(...scores);
    const avgScore = (scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(1);

    setResults(gradedRows);
    setMetrics({ total: gradedRows.length, max: maxScore, min: minScore, avg: avgScore });
  };

  // 📥 Automatic CSV Complier & Downloader
  const downloadCSV = () => {
    if (results.length === 0) return;

    const headers = [
      "Student ID", "Full Name", "Variant", 
      "Math Correct", "Math Wrong", "Math Unanswered", "Math Score",
      "Reading Correct", "Reading Wrong", "Reading Unanswered", "Reading Score", 
      "Total Score"
    ];

    const rows = results.map(r => [
      r.studentId, r.fullName, r.variant,
      r.mathCorrect, r.mathWrong, r.mathBlank, r.mathScore,
      r.readCorrect, r.readWrong, r.readBlank, r.readScore,
      r.totalScore
    ]);

    const csvContent = "\uFEFF" + [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `variant_${variant}_grading_results.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div style={{ fontFamily: 'sans-serif', padding: '30px', maxWidth: '1200px', margin: '0 auto', backgroundColor: '#f8fafc' }}>
      <header style={{ borderBottom: '2px solid #e2e8f0', paddingBottom: '20px', marginBottom: '30px' }}>
        <h1 style={{ color: '#1e293b', margin: 0 }}>📊 UNT Exam Grading App</h1>
        <p style={{ color: '#64748b', margin: '5px 0 0' }}>Upload text raw file matrices to run algorithmic score processing instantly.</p>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: '30px' }}>
        {/* Left Side: Control panel */}
        <section style={{ backgroundColor: '#ffffff', padding: '20px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', height: 'fit-content' }}>
          <h3 style={{ margin: '0 0 15px', color: '#334155' }}>Control Center</h3>
          
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', fontSize: '14px', color: '#475569' }}>Select Variant:</label>
          <select value={variant} onChange={(e) => setVariant(e.target.value)} style={{ width: '100%', padding: '10px', marginBottom: '20px', borderRadius: '6px', border: '1px solid #cbd5e1' }}>
            <option value="1">Variant 1</option>
            <option value="2">Variant 2</option>
            <option value="3">Variant 3</option>
          </select>

          <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', fontSize: '14px', color: '#475569' }}>Upload Layout Text (.txt):</label>
          <input type="file" accept=".txt" onChange={handleFileUpload} style={{ width: '100%', marginBottom: '20px', fontSize: '13px' }} />
          {fileName && <p style={{ fontSize: '12px', color: '#059669', margin: '-15px 0 20px' }}>📄 Loaded: {fileName}</p>}

          <button onClick={processGrading} style={{ width: '100%', padding: '12px', backgroundColor: '#2563eb', color: 'white', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', marginBottom: '10px' }}>
            Calculate & Grade
          </button>

          <button onClick={downloadCSV} disabled={results.length === 0} style={{ width: '100%', padding: '12px', backgroundColor: results.length === 0 ? '#cbd5e1' : '#10b981', color: 'white', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: results.length === 0 ? 'not-allowed' : 'pointer' }}>
            Download CSV Spreadsheet
          </button>
          
          {error && <p style={{ color: '#dc2626', fontSize: '13px', marginTop: '15px', backgroundColor: '#fef2f2', padding: '10px', borderRadius: '4px' }}>{error}</p>}
        </section>

        {/* Right Side: Data view */}
        <main>
          {metrics && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '15px', marginBottom: '30px' }}>
              <div style={{ background: '#eff6ff', padding: '15px', borderRadius: '8px', border: '1px solid #bfdbfe', textAlign: 'center' }}>
                <span style={{ fontSize: '13px', color: '#1e40af', fontWeight: 'bold' }}>Graded Count</span>
                <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#1e3a8a', marginTop: '5px' }}>{metrics.total} Students</div>
              </div>
              <div style={{ background: '#ecfdf5', padding: '15px', borderRadius: '8px', border: '1px solid #a7f3d0', textAlign: 'center' }}>
                <span style={{ fontSize: '13px', color: '#065f46', fontWeight: 'bold' }}>Top Score</span>
                <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#064e3b', marginTop: '5px' }}>{metrics.max} pts</div>
              </div>
              <div style={{ background: '#fff7ed', padding: '15px', borderRadius: '8px', border: '1px solid #ffedd5', textAlign: 'center' }}>
                <span style={{ fontSize: '13px', color: '#9a3412', fontWeight: 'bold' }}>Class Average</span>
                <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#7c2d12', marginTop: '5px' }}>{metrics.avg} pts</div>
              </div>
              <div style={{ background: '#fef2f2', padding: '15px', borderRadius: '8px', border: '1px solid #fee2e2', textAlign: 'center' }}>
                <span style={{ fontSize: '13px', color: '#991b1b', fontWeight: 'bold' }}>Lowest Score</span>
                <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#7c1d1d', marginTop: '5px' }}>{metrics.min} pts</div>
              </div>
            </div>
          )}

          {results.length > 0 ? (
            <div style={{ backgroundColor: '#white', padding: '20px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', overflowX: 'auto' }}>
              <h3 style={{ margin: '0 0 15px', color: '#334155' }}>Grading Sheets — Variant {variant}</h3>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px' }}>
                <thead>
                  <tr style={{ backgroundColor: '#f1f5f9', borderBottom: '2px solid #cbd5e1' }}>
                    <th style={{ padding: '10px' }}>Student ID</th>
                    <th style={{ padding: '10px' }}>Full Name</th>
                    <th style={{ padding: '10px' }}>Math Score</th>
                    <th style={{ padding: '10px' }}>Reading Score</th>
                    <th style={{ padding: '10px', fontWeight: 'bold', color: '#2563eb' }}>Total Score</th>
                  </tr>
                </thead>
                <tbody>
                  {results.map((row, idx) => (
                    <tr key={idx} style={{ borderBottom: '1px solid #e2e8f0', backgroundColor: idx % 2 === 0 ? '#ffffff' : '#f8fafc' }}>
                      <td style={{ padding: '10px', fontFamily: 'monospace' }}>{row.studentId}</td>
                      <td style={{ padding: '10px', fontWeight: '500' }}>{row.fullName}</td>
                      <td style={{ padding: '10px' }}>{row.mathScore} <span style={{fontSize:'12px', color:'#64748b'}}>({row.mathCorrect}R / {row.mathWrong}W)</span></td>
                      <td style={{ padding: '10px' }}>{row.readScore} <span style={{fontSize:'12px', color:'#64748b'}}>({row.readCorrect}R / {row.readWrong}W)</span></td>
                      <td style={{ padding: '10px', fontWeight: 'bold', color: '#2563eb' }}>{row.totalScore} pts</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div style={{ border: '2px dashed #cbd5e1', borderRadius: '8px', padding: '5px 0', textAlign: 'center', color: '#94a3b8', height: '250px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
              <span style={{ fontSize: '48px' }}>📁</span>
              <p style={{ marginTop: '10px', fontSize: '15px' }}>No file graded yet. Upload a data matrix layout and click "Calculate & Grade".</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
