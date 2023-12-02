

const LoadingScreen = () => {
    const styles = {
        container: {
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: '20rem',
          margin: 0,
        },
        spinner: {
          border: '4px solid rgba(0, 0, 0, 0.1)',
          borderLeft: '4px solid #3498db',
          borderRadius: '50%',
          width: '40px',
          height: '40px',
          animation: 'spin 1s linear infinite',
        },
        message: {
          marginLeft: '10px',
          fontSize: '16px',
        },
        '@keyframes spin': {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
      };
    return (
      <div style={styles.container}>
        <h1></h1>
        <div style={styles.spinner}></div>
        <p style={styles.message}>로딩 중...</p>
      </div>
    );
  };

  


  export default LoadingScreen;


