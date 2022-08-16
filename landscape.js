import React from 'react'

const landscape = ({x,y,direction}) => {
return (
<div 
datax = {x} 
className="landscape"
datay = {y}>
{direction(x, y)}
{((userX === {x}) && (userY === {y}))?user:''}
</div>) 
}

export default landscape;