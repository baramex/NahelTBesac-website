export function Check(props) {
    return (<svg preserveAspectRatio="xMidYMid meet" viewBox="40.026 40.026 319.948 319.948" fill="currentColor" xmlns="http://www.w3.org/2000/svg" role="presentation" aria-hidden="true" {...props}>
        <g>
            <path d="M200 40.026c-88.351 0-159.974 71.623-159.974 159.974S111.649 359.974 200 359.974c88.352 0 159.974-71.623 159.974-159.974S288.352 40.026 200 40.026zm17.786 228.68h-50.202l-.638-1.422.054-.117-12.914-28.099v-.001l-35.254-76.47h51.493l22.422 48.548 36.928-79.852h51.494l-63.383 137.413z"></path>
            <path opacity=".3" d="M192.747 211.146l-25.039 57.56-10.601-23.065 17.82-73.079 17.82 38.584z"></path>
        </g>
    </svg>);
}

export function Triangle(props) {
    return (<svg viewBox="-1 -1 18 12" {...props}>
        <polygon points="0,0 8,10 16,0" fill="none" strokeWidth={2} />
    </svg>)
}


export function FuelGauge({ percentage, ...props }) {
    return (<svg viewBox="15 15 70 55" {...props}>
        <LineOnCircleToCenter cx="50" cy="60" r="45" l="10" angle={degToRad(90)} stroke="currentColor" strokeWidth="3" />
        <LineOnCircleToCenter cx="50" cy="60" r="45" l="8" angle={degToRad(70)} stroke="currentColor" strokeWidth="2" />
        <LineOnCircleToCenter cx="50" cy="60" r="45" l="10" angle={degToRad(50)} stroke="#EE2D2D" strokeWidth="3" />
        <LineOnCircleToCenter cx="50" cy="60" r="45" l="8" angle={degToRad(110)} stroke="currentColor" strokeWidth="2" />
        <LineOnCircleToCenter cx="50" cy="60" r="45" l="10" angle={degToRad(130)} stroke="currentColor" strokeWidth="3" />

        <text x="75" y="49" textAnchor="middle" fontSize="11" fill="currentColor" fontWeight="bold">F</text>
        <text x="25" y="49" textAnchor="middle" fontSize="11" fill="currentColor" fontWeight="bold">E</text>

        <path fill="currentColor" d="m46.5 37.5h6.272c.0619 0 .112.0619.112.112v.672c0 .0619-.0502.112-.112.112h-6.272c-.0619 0-.112-.0619-.112-.112v-.672c0-.0619.0502-.112.112-.112z" />
        <path fill="currentColor" d="m55 31c-.011-.011-.0231-.0209-.0361-.0294l-.7971-.5191c-.0036-.0027-.0072-.0052-.0109-.0076l-.983-.6397-.0011-.0007c-.1037-.0675-.2425-.0382-.31.0655s-.0381.2424.0655.3099l.8823.5746v.6466c.0002.2575.098.5054.2738.6938.1757.1884.4162.3032.673.3214v4.4696c-.0001.1262-.0503.2472-.1395.3364-.0892.0892-.2102.1395-.3364.1395h-.0975c-.1262-.0001-.2472-.0503-.3364-.1395-.0892-.0892-.1395-.2102-.1396-.3364v-3.1596c-.0003-.2735-.1091-.5357-.3024-.7291-.1934-.1934-.4556-.3022-.7291-.3025h-.3405v-2.921c0-.1856-.0738-.3637-.2051-.495-.1313-.1313-.3093-.205-.4949-.205h-4.2c-.1857 0-.3638.0738-.495.205-.1313.1313-.205.3094-.205.495v7.868c0 .0928.0752.168.168.168h5.264c.0928 0 .168-.0752.168-.168v-4.499h.3405c.1547.0002.303.0617.4124.1711s.1709.2577.1711.4124v3.1596c.0003.2449.0977.4798.2709.653.1732.1732.4081.2706.653.2709h.0975c.2449-.0003.4798-.0977.653-.2709.1732-.1733.2706-.4081.2709-.653v-5.3918c.0005-.1852-.0732-.3627-.2045-.4932zm-3.7476.527c0 .0843-.0335.1651-.0931.2247s-.1404.0931-.2247.0931h-2.7992c-.0842 0-.1651-.0335-.2247-.0931s-.093-.1404-.093-.2247v-1.2871c0-.0843.0334-.1651.093-.2247s.1405-.0931.2247-.0931h2.7992c.0843 0 .1651.0335.2247.0931s.0931.1404.0931.2247zm3.5042.4384h-.0001c-.1377-.0174-.2642-.0844-.3561-.1884-.0918-.1041-.1426-.238-.1427-.3767v-.3548l.4391.2859v-.0001c.0387.0451.0599.1026.0598.162z" />

        <LineOnCircleToCenter cx="50" cy="60" l="40" extra="start" angle={degToRad(50 + (percentage / 100 * 80))} stroke="#EE2D2D" strokeWidth="2" />
        <circle cx="50" cy="60" r="5" fill="currentColor" />
    </svg>)
}

function LineOnCircleToCenter({ cx, cy, r, l, angle, extra = "end", ...props }) {
    if (extra === "end") {
        const x1 = cx - Math.cos(angle) * r;
        const y1 = cy - Math.sin(angle) * r;
        const x2 = x1 + Math.cos(angle) * l;
        const y2 = y1 + Math.sin(angle) * l;

        return <line x1={x1} x2={x2} y1={y1} y2={y2} {...props} />;
    }
    else if (extra === "start") {
        const x1 = cx - Math.cos(angle) * l;
        const y1 = cy - Math.sin(angle) * l;

        return <line x1={x1} x2={cx} y1={y1} y2={cy} {...props} />;
    }
}

function degToRad(deg) {
    var pi = Math.PI;
    return deg * (pi / 180);
}