interface HeaderStyles{
    largerScreen:{
        htecLogo:{},
        emptyBox:{}
    },
    smallerScreen:{
        htecLogo:{},
        emptyBox:{}
    }

}


const headerStyles:HeaderStyles={
    largerScreen:{
        htecLogo:{
            backgroundColor:'#32675B',
            backgroundImage:'url(/assets/htecLogo.svg)',height:'80px',
            backgroundRepeat:'no-repeat',backgroundPosition:'center',
            backgroundSize:'cover',width:'20%'
        },
        emptyBox:{backgroundColor:'#32675B',height:'80px',width:'70%'}

    },
    smallerScreen:{
        htecLogo:{
            backgroundColor:'#32675B',
            backgroundImage:'url(/assets/htecLogo.svg)',height:'80px',
            backgroundRepeat:'no-repeat',backgroundPosition:'center',
            backgroundSize:'cover',width:'35%'
        },
        emptyBox:{backgroundColor:'#32675B',height:'80px',width:'55%'}
    }
}

export default headerStyles