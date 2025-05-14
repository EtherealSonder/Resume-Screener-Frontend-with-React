export default function FancyContainer({ children }) {
    return (
        <div
            className="min-h-screen bg-cover bg-center flex items-center justify-center font-sans overflow-hidden"
            style={{ backgroundImage: `url('/src/assets/bg.jpg')` }}
        >
            <div className="p-8 rounded-3xl bg-white/10 backdrop-blur-md border border-white/20 shadow-2xl w-[360px] text-center animate-fadeIn transition-opacity duration-500">
                {children}
            </div>
        </div>
    );
}
