import html2pdf from "html2pdf.js";

export default function ExportButtons({ data, fileName = "Export", targetRef = null, exportCSVOnly = false, exportPNGOnly = false }) {
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

    const exportPNG = () => {
        const element = targetRef?.current;
        if (!element) return;

        import("html-to-image").then(htmlToImage => {
            htmlToImage.toPng(element).then(dataUrl => {
                const link = document.createElement("a");
                link.download = `${fileName}.png`;
                link.href = dataUrl;
                link.click();
            });
        });
    };

    return (
        <div className="flex gap-2 mt-3">
            {!exportCSVOnly && targetRef && (
                <button onClick={exportPNG} className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700">Export PNG</button>
            )}
            {!exportPNGOnly && (
                <button onClick={exportCSV} className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700">Export CSV</button>
            )}
        </div>
    );
}
