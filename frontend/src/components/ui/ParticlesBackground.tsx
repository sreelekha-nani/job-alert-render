import React from "react";
import Particles from "@tsparticles/react";

const ParticlesBackground: React.FC = () => {
    const options = {
        background: {
            color: {
                value: "#1a0033",
            },
        },
        fpsLimit: 60,
        interactivity: {
            events: {
                onHover: {
                    enable: true,
                    mode: "repulse",
                },
                resize: true,
            },
            modes: {
                repulse: {
                    distance: 100,
                    duration: 0.4,
                },
            },
        },
        particles: {
            color: {
                value: "#8b5cf6",
            },
            links: {
                color: "#8b5cf6",
                distance: 150,
                enable: true,
                opacity: 0.2,
                width: 1,
            },
            collisions: {
                enable: true,
            },
            move: {
                direction: "none" as const,
                enable: true,
                outModes: {
                    default: "bounce" as const,
                },
                random: false,
                speed: 1,
                straight: false,
            },
            number: {
                density: {
                    enable: true,
                    area: 800,
                },
                value: 50,
            },
            opacity: {
                value: 0.3,
            },
            shape: {
                type: "circle" as const,
            },
            size: {
                value: { min: 1, max: 3 },
            },
        },
        detectRetina: true,
    };

    return (
        <div className="absolute inset-0 z-0">
            <Particles
                id="tsparticles"
                options={options as any}
            />
        </div>
    );
};

export default ParticlesBackground;
