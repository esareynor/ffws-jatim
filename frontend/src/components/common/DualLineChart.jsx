import React, { useEffect } from 'react';

const DualLineChart = ({
  actual = [],
  predicted = [],
  width = 800,
  height = 400,
  className = '',
  canvasId = 'dual-line-chart'
}) => {
  useEffect(() => {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const seriesA = actual || [];
    const seriesB = predicted || [];
    const len = Math.max(seriesA.length, seriesB.length);
    if (len < 2) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      return;
    }

    // Hitung skala untuk sumbu Y (0-3.5m seperti di gambar)
    const allValues = [...seriesA, ...seriesB].filter(v => typeof v === 'number');
    const minValue = 0;
    const maxValue = Math.max(3.5, ...allValues, 1);
    const range = maxValue - minValue || 1;

    // Padding untuk chart area - lebih besar untuk kejelasan
    const padding = { top: 40, right: 60, bottom: 100, left: 100 };
    const chartWidth = width - padding.left - padding.right;
    const chartHeight = height - padding.top - padding.bottom;

    // Set canvas size untuk high DPI
    const devicePixelRatio = window.devicePixelRatio || 1;
    canvas.width = width * devicePixelRatio;
    canvas.height = height * devicePixelRatio;
    canvas.style.width = width + 'px';
    canvas.style.height = height + 'px';
    ctx.scale(devicePixelRatio, devicePixelRatio);

    // Reset
    ctx.clearRect(0, 0, width, height);

    // Font settings - lebih besar dan jelas
    ctx.font = '14px Inter, -apple-system, BlinkMacSystemFont, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    // Grid horizontal (sumbu Y) - lebih tebal dan jelas
    ctx.strokeStyle = '#E5E7EB';
    ctx.lineWidth = 1.5;
    const ySteps = 8; // 0, 0.5, 1.0, 1.5, 2.0, 2.5, 3.0, 3.5
    for (let i = 0; i <= ySteps; i++) {
      const value = (i / ySteps) * maxValue;
      const y = padding.top + (1 - i / ySteps) * chartHeight;
      
      // Grid line
      ctx.beginPath();
      ctx.moveTo(padding.left, y);
      ctx.lineTo(padding.left + chartWidth, y);
      ctx.stroke();

      // Y-axis label - lebih besar dan jelas
      ctx.fillStyle = '#1F2937';
      ctx.font = 'bold 14px Inter, -apple-system, BlinkMacSystemFont, sans-serif';
      ctx.textAlign = 'right';
      ctx.fillText(value.toFixed(1), padding.left - 10, y);
    }

    // Grid vertical (sumbu X) - setiap jam
    ctx.strokeStyle = '#F3F4F6';
    ctx.lineWidth = 1;
    for (let i = 0; i <= 24; i++) {
      const x = padding.left + (i / 24) * chartWidth;
      ctx.beginPath();
      ctx.moveTo(x, padding.top);
      ctx.lineTo(x, padding.top + chartHeight);
      ctx.stroke();
    }

    // X-axis labels (setiap 2 jam) - lebih besar dan jelas
    ctx.fillStyle = '#1F2937';
    ctx.font = 'bold 13px Inter, -apple-system, BlinkMacSystemFont, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    for (let i = 0; i <= 24; i += 2) {
      const hour = (10 + i) % 24; // Mulai dari 10:00
      const x = padding.left + (i / 24) * chartWidth;
      const timeLabel = `${hour.toString().padStart(2, '0')}:00`;
      ctx.save();
      ctx.translate(x, padding.top + chartHeight + 15);
      ctx.rotate(-Math.PI / 4); // Rotate 45 degrees
      ctx.fillText(timeLabel, 0, 0);
      ctx.restore();
    }

    // Chart area background
    ctx.fillStyle = '#FAFAFA';
    ctx.fillRect(padding.left, padding.top, chartWidth, chartHeight);

    const toXY = (idx, value) => {
      const x = padding.left + (idx / (len - 1)) * chartWidth;
      const y = padding.top + chartHeight - ((value - minValue) / range) * chartHeight;
      return { x, y };
    };

    // Area fill untuk aktual (light blue)
    ctx.beginPath();
    ctx.moveTo(padding.left, padding.top + chartHeight);
    seriesA.forEach((v, i) => {
      const { x, y } = toXY(i, v);
      ctx.lineTo(x, y);
    });
    ctx.lineTo(padding.left + chartWidth, padding.top + chartHeight);
    ctx.closePath();
    ctx.fillStyle = '#22D3EE20';
    ctx.fill();

    // Garis aktual (light blue) - lebih tebal dan jelas
    ctx.beginPath();
    ctx.strokeStyle = '#22D3EE';
    ctx.lineWidth = 2;
    seriesA.forEach((v, i) => {
      const { x, y } = toXY(i, v);
      if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
    });
    ctx.stroke();

    // Garis prediksi (orange) - lebih tebal dan jelas
    ctx.beginPath();
    ctx.strokeStyle = '#F97316';
    ctx.lineWidth = 2;
    seriesB.forEach((v, i) => {
      const { x, y } = toXY(i, v);
      if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
    });
    ctx.stroke();

    // Data points - lebih besar dan jelas
    const drawDots = (values, color) => {
      ctx.fillStyle = color;
      values.forEach((v, i) => {
        const { x, y } = toXY(i, v);
        ctx.beginPath();
        ctx.arc(x, y, 4, 0, Math.PI * 2);
        ctx.fill();
        // White border untuk kontras
        ctx.strokeStyle = '#FFFFFF';
        ctx.lineWidth = 2;
        ctx.stroke();
      });
    };
    drawDots(seriesA, '#22D3EE');
    drawDots(seriesB, '#F97316');

    // Chart border - lebih tebal
    ctx.strokeStyle = '#D1D5DB';
    ctx.lineWidth = 2;
    ctx.strokeRect(padding.left, padding.top, chartWidth, chartHeight);

  }, [actual, predicted, width, height, canvasId]);

  return (
    <div className={className}>
      {/* Legend */}
      <div className="flex items-center justify-end gap-6 text-sm mb-3">
        <div className="flex items-center gap-2">
          <span className="inline-block w-6 h-1.5 rounded bg-cyan-400" />
          <span className="text-gray-900 font-semibold">Aktual</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-block w-6 h-1.5 rounded bg-orange-500" />
          <span className="text-gray-900 font-semibold">Prediksi</span>
        </div>
      </div>
      {/* Chart Container */}
      <div className="relative">
        <canvas id={canvasId} width={width} height={height} className="w-full" />
        
        {/* Y-axis Label */}
        <div className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-y-2 -rotate-90 text-base font-bold text-gray-900 whitespace-nowrap origin-center">
          Tinggi Air (m)
        </div>
        
        {/* X-axis Label */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-base font-bold text-gray-900">
          Periode Waktu
        </div>
      </div>
    </div>
  );
};

export default DualLineChart;



