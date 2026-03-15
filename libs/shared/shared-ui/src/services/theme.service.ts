import { Injectable } from "@angular/core";

@Injectable({
  providedIn:'root'
})


export class ThemeCustomService{



  colorFactor(color: string): string {
  switch (color) {
    case 'DodgerBlue':
      return '#1E90FF';
    case 'SteelBlue':
      return '#4682B4';
    case 'SkyBlue':
      return '#73C0DE';
    case 'PowderBlue':
      return '#B0E0E6';
    case 'DarkGreen':
      return '#2E8B57';
    case 'Teal':
      return '#3BA272';
    case 'Green':
      return '#91CC75';
    case 'GreenYellow':
      return '#ADFF2F';
    case 'Gold':
      return '#FFD700';
    case 'LightYellow':
      return '#FAC858';
    case 'Orange':
      return '#FFA500';
    case 'DarkOrange':
      return '#FF8C00';
    case 'Pink':
      return '#EA7CCC';
    case 'HotPink':
      return '#FF69B4';
    case 'MediumPurple':
      return '#9370DB';
    case 'Purple':
      return '#9A60B4';
    case 'Tomato':
      return '#FF6347';
    case 'OrangeRed':
      return '#FF4500';
    case 'Red':
      return '#FF0000';
    case 'DarkRed':
      return '#DC143C';
    case 'LightGray':
      return '#D3D3D3';
    case 'DarkGray':
      return '#A9A9A9';
    case 'Gray':
      return '#808080';
    case 'DimGray':
      return '#696969';

    // your old custom names if needed
    case 'Blue':
      return '#158DF7';
    case 'Yellow':
      return '#FFFF32';
    case 'Blue Light':
      return '#026AA2';


    default:
      return '#8B5CF6';
  }
}


}
