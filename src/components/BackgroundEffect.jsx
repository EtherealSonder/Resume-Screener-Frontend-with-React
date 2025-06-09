import { useCallback } from "react";
import Particles from "react-tsparticles";
import { loadAll } from "@tsparticles/all";
import { Engine } from "@tsparticles/engine";

export default function BackgroundEffect() {
    const particlesInit = useCallback(async (engine: Engine) => {
        await loadAll(engine);
    }, []);

    return (
        <Particles
            id="tsparticles"
            init={particlesInit}
            className="fixed inset-0 -z-10 pointer-events-none"
            options={{
                fullScreen: false,
                background: { color: "#1f2937" },
                fpsLimit: 60,
                detectRetina: true,
                particles: {
                    number: {
                        value: 60,
                        density: {
                            enable: true,
                            area: 800,
                        },
                    },
                    color: { value: "#a855f7" },
                    links: {
                        enable: true,
                        distance: 150,
                        color: "#a855f7",
                        opacity: 0.2,
                        width: 1,
                    },
                    move: {
                        enable: true,
                        speed: 0.5,
                        direction: "none",
                        outModes: { default: "bounce" },
                    },
                    opacity: { value: 0.2 },
                    size: { value: 3 },
                },
            }}
        />
    );
}
