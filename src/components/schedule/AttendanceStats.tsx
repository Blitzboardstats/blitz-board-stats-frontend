
import React from 'react';

interface AttendanceStatsProps {
  attendanceStats: {
    attending: number;
    maybe: number;
    notAttending: number;
    pending: number;
  };
}

const AttendanceStats = ({ attendanceStats }: AttendanceStatsProps) => {
  return (
    <div className="grid grid-cols-4 gap-2 mb-4 text-center text-sm">
      <div className="bg-green-600/20 text-green-400 p-2 rounded">
        <div className="font-semibold">{attendanceStats.attending}</div>
        <div>Going</div>
      </div>
      <div className="bg-yellow-600/20 text-yellow-400 p-2 rounded">
        <div className="font-semibold">{attendanceStats.maybe}</div>
        <div>Maybe</div>
      </div>
      <div className="bg-red-600/20 text-red-400 p-2 rounded">
        <div className="font-semibold">{attendanceStats.notAttending}</div>
        <div>No</div>
      </div>
      <div className="bg-gray-600/20 text-gray-400 p-2 rounded">
        <div className="font-semibold">{attendanceStats.pending}</div>
        <div>Pending</div>
      </div>
    </div>
  );
};

export default AttendanceStats;
