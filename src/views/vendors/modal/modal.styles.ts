interface AddProductModalStyles {
    largerScreen: {
        modal:React.CSSProperties 
        ;
        textField: React.CSSProperties 
        button: React.CSSProperties 
    };
    smallerScreen: {
        modal: React.CSSProperties 
        textField:React.CSSProperties 
        button:React.CSSProperties 
    };
}

const styles: AddProductModalStyles = {
    largerScreen: {
        modal: {
            display:'flex',
            flexDirection:'column',
            
            backgroundColor: '#D0FBE8',
            boxShadow: '24',
            padding:'20px',
            width:'400px',
            borderRadius:'10px',
            color: '#32675B',
        },
        textField: { backgroundColor:'white',
            color: '#32675B',
            margin: '5px',
        },
        button: {
            marginTop: '10px',
            backgroundColor: '#32675B',
        },
    },
    smallerScreen: {
        modal: {
            width:'200px',
            display:'flex',
            flexDirection:'column',
            backgroundColor: '#D0FBE8',
            boxShadow: '24',
            padding: '20px',
            
            borderRadius: '10px',
            color: '#32675B',
        },
        textField: {
            backgroundColor:'white',
            color: '#32675B',
            margin: '5px',
        },
        button: {
            marginTop: '10px',
            backgroundColor: '#32675B',
        },
    },
};

export default styles;
