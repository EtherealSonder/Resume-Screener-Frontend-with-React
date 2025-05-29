import React from "react";
import { ResponsiveRadar } from "@nivo/radar";

export default function RadarSkillChart({ data, selectedJobs }) {
    if (!data || data.length === 0 || !selectedJobs || selectedJobs.length === 0) {
        return (
            <p className="italic text-gray-500 text-center py-4">
                Not enough shared skills to generate a radar chart. Try comparing jobs with more overlap.
            </p>
        );
    }

    return (
        <div className="w-full h-[400px] bg-gray-100 rounded p-4">
            <ResponsiveRadar
                data={data}
                keys={selectedJobs}
                indexBy="skill"
                maxValue="auto"
                margin={{ top: 40, right: 90, bottom: 40, left: 90 }}
                curve="linearClosed"
                borderWidth={2}
                gridLevels={5}
                gridShape="circular"
                gridLabelOffset={36}
                dotSize={10}
                dotColor={{ theme: "background" }}
                dotBorderWidth={2}
                colors={{ scheme: "paired" }}
                fillOpacity={0.25}
                blendMode="multiply"
                animate={true}
                motionConfig="wobbly"
                isInteractive={true}
                legends={[
                    {
                        anchor: "bottom",
                        direction: "row",
                        translateY: 30,
                        itemWidth: 80,
                        itemHeight: 20,
                        itemTextColor: "#333",
                        symbolSize: 12,
                        symbolShape: "circle"
                    }
                ]}
                theme={{
                    axis: {
                        ticks: {
                            text: {
                                fontSize: 12,
                                fill: "#374151",
                                whiteSpace: "normal",
                                overflow: "visible",
                                textOverflow: "clip"
                            }
                        }
                    }
                }}
            />
        </div>
    );
}
