const statuses = [
    "Pengajuan",
    "PIC K3",
    "Verifikasi",
    "Proses Penanganan",
    "Selesai",
];

const statuses2 = [
    "Pengajuan",
    "PIC K3",
    "Verifikasi",
    "Selesai",
]

const ProgressTracker = ({ currentStatus }) => {
    const getStatusClass = (status) => {
        if (status === currentStatus) {
            return "bg-green-500 text-white";  // Untuk status yang aktif
        } else if (statuses.indexOf(status) < statuses.indexOf(currentStatus)) {
            return "bg-green-200 text-green-600";  // Status yang sudah lewat
        } else {
            return "bg-gray-200 text-gray-600";  // Status yang belum tercapai
        }
    };

    return (
        <div className="flex items-start justify-between p-3 space-x-4">
            {statuses.map((status, index) => (
                <div
                    key={index}
                    className="flex flex-col items-center space-y-2"
                >
                    <div
                        className={`flex items-center justify-center w-16 h-16 rounded-full ${getStatusClass(status)}`}
                    >
                        <span className="text-sm font-semibold">{index + 1}</span>
                    </div>
                    <div className="text-xs font-medium text-center">
                        {status}
                    </div>
                </div>
            ))}
        </div>
    );
};

const ProgressTracker2 = ({ currentStatus }) => {
    const getStatusClass = (status) => {
        if (status === currentStatus) {
            return "bg-green-500 text-white";  // Untuk status yang aktif
        } else if (statuses2.indexOf(status) < statuses2.indexOf(currentStatus)) {
            return "bg-green-200 text-green-600";  // Status yang sudah lewat
        } else {
            return "bg-gray-200 text-gray-600";  // Status yang belum tercapai
        }
    };

    return (
        <div className="flex items-start justify-between p-3 space-x-4">
            {statuses2.map((status, index) => (
                <div
                    key={index}
                    className="flex flex-col items-center space-y-2"
                >
                    <div
                        className={`flex items-center justify-center w-16 h-16 rounded-full ${getStatusClass(status)}`}
                    >
                        <span className="text-sm font-semibold">{index + 1}</span>
                    </div>
                    <div className="text-xs font-medium text-center">
                        {status}
                    </div>
                </div>
            ))}
        </div>
    );
};

export { ProgressTracker, ProgressTracker2 };
