import html2pdf from "html2pdf.js";

export default function ExportButtons({ data, fileName = "Export", targetRef = null }) {
    const exportCSV = () => {
        if (!data || data.length === 0) return;
        const keys = Object.keys(data[0]);
        const csv = [
            keys.join(","),
            ...data.map(row => keys.map(k => JSON.stringify(row[k] ?? "")).join(","))
        ].join("\n");

        const blob = new Blob([csv], { type: "text/csv" });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = `${fileName}.csv`;
        link.click();
    };

    const exportPDF = () => {
        const element = targetRef?.current;
        if (!element) return;

        html2pdf().from(element).set({
            margin: 10,
            filename: `${fileName}.pdf`,
            html2canvas: { scale: 2 },
            jsPDF: { orientation: "landscape" }
        }).save();
    };

    return (
        <div className="flex gap-2 mt-3">
            <button onClick={exportCSV} className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700">Export CSV</button>
            {targetRef && (
                <button onClick={exportPDF} className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700">Export PDF</button>
            )}
        </div>
    );
}
