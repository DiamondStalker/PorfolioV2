export const Gists = ({ id, description, html_url }) => {
    return (
        <div key={id} style={{
            background: '#12121283',
            border: '1px solid #ccc',
            padding: '20px',
            borderRadius: '10px',
            width: '250px',
            display: 'flex',
            flexDirection: 'column'
        }}>
            <h3>{description}</h3>
            <div className="buttonStyles" style={{ marginTop: 'auto' }} >
                <button
                    style={{
                        width: "95%",
                        marginLeft: "2.5%",
                    }}
                    type="button" className="text-white bg-gradient-to-br from-purple-600 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2">
                    <a href={html_url} target="_blank" rel="noopener noreferrer" >
                        View Gists
                    </a>
                </button>

            </div>
        </div>
    )
}

export default Gists;