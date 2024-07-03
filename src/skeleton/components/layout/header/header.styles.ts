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
            
            paddingTop:'30px',
            backgroundColor:'black',
            backgroundImage:'url(/assets/htecLogo.svg)',
            height:'50px',
            backgroundRepeat:'no-repeat',backgroundPosition:'center',
            backgroundSize:'cover',width:'20%',
        },
        emptyBox:{background:'black',height:'50px',width:'70%'}

    },
    smallerScreen:{
        htecLogo:{
            backgroundColor:'black',
            backgroundImage:'url(/assets/htecLogo.svg)',height:'50px',
            backgroundRepeat:'no-repeat',backgroundPosition:'center',
            backgroundSize:'cover',width:'35%'
        },
        emptyBox:{backgroundColor:'black',height:'50px',width:'55%'}
    }
}

export default headerStyles