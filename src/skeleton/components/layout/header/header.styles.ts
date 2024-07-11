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
            
            backgroundImage:'url(/assets/htecLogo.svg)',
            height:'50px',
            backgroundRepeat:'no-repeat',backgroundPosition:'center',
            backgroundSize:'cover',width:'20%',
        },
        emptyBox:{height:'50px',width:'70%'}

    },
    smallerScreen:{
        htecLogo:{
            
            backgroundImage:'url(/assets/htecLogo.svg)',height:'50px',
            backgroundRepeat:'no-repeat',backgroundPosition:'center',
            backgroundSize:'cover',width:'35%'
        },
        emptyBox:{height:'50px',width:'55%'}
    }
}

export default headerStyles