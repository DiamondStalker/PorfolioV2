import diamondSvg from '../assets/img/DiamondLogo.png' // Asegúrate de tener un archivo SVG de diamante

export default function DiamondLoader() {
    return (
        <div style={overlayStyles}>
            <div style={diamondContainerStyles}>
                <img src={diamondSvg} alt="Diamante" style={imageStyles} />
                <h2>Loading...</h2>
            </div>
        </div>
    )
}

// Estilos
const overlayStyles = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
}

const diamondContainerStyles = {
    width: '100px',
    height: '100px',
    animation: 'diamond-pulse 1.5s ease-in-out infinite',
}

const imageStyles = {
    width: '100%',
    height: '100%',
    objectFit: 'contain',
}
