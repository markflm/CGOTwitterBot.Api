

const checkApiCredentials = (incomingKey) =>
{
var cleanedKey = incomingKey?.replace(/\\/g,'');
var validKey = cleanedKey == 'q@yy,6Ny-=K&yAWLC#U"$]]eL*Phty"q!e=36dhyg8VJ>8^%_u{]fE@Tywq^%JWmZ~CHR`_Y\%U&AW>FvjMd[#wE4fr68wRksfBeJ2^nw_eDPTB6P_;E~/?av,q<-8'
return validKey;
}

//q@yy,6Ny-=K&yAWLC#U"$]]eL*Phty"q!e=36dhyg8VJ>8^%_u{]fE@Tywq^%JWmZ~CHR`_Y\%U&AW>FvjMd[#wE4fr68wRksfBeJ2^nw_eDPTB6P_;E~/?av,q<-8
module.exports = checkApiCredentials;