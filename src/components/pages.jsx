function getImageData(projectName){
    return Array(
      {src: `/textures/${projectName}/1.png`,
      size: [ 600, 321], // optional: slight variation
      position: [100, 20],
      rotation: [-Math.PI, 0, Math.PI * 0.03]},
      {src: `/textures/${projectName}/2.png`,
      size: [ 600, 321], // optional: slight variation
      position: [300, 351],
      rotation: [-Math.PI, 0, Math.PI * 0.03]},
      {src: `/textures/${projectName}/3.png`,
      size: [ 600, 321], // optional: slight variation
      position: [100, 687],
      rotation: [-Math.PI, 0, Math.PI * 0.03]},
    );
}

export const pages = [
  {
    front: 'scene.jpg',
    imageData: getImageData('rma'),
    title: 'Restaurant Management app',
    description: 'A full-stack web application designed to streamline restaurant operations, including reservations, menu management, table availability, and inventory tracking. It features real-time table availability, dynamic menu updates, and efficient backend integration with stored procedures and triggers for optimized performance. This project showcases my skills in full-stack development and database management.',
    tech: "- React, CSS, Bootstrap, Node, Express, MySql"
},
{
    imageData: getImageData('airbnb'),
    fillColor: '#0d1b2a',
    title: 'Airbnb Clone',
    description: 'A web application replicating Airbnb’s core features, including property listings, secure user authentication, and dynamic booking functionality. The project ensures error management on both front-end and back-end, providing clear user feedback for issues like invalid inputs or booking conflicts, while back-end handles exceptions and logs errors securely. This showcases expertise in full-stack development and building reliable, user-focused applications. ',
    tech: "- HTML, CSS, EJS, Node, Express, Mongoose"

},
{
    imageData: getImageData('bigbull'),
    title: 'Bigbull',
    fillColor: '#3d4a3d',
    description: 'The Big Bull is an interactive stock trading web application designed to simulate real-world trading and enhance learning without financial risk. It features real-time stock data, user authentication, portfolio management, watchlists, a trading panel for buying and selling stocks, and a competitive leaderboard to track user performance.',
    tech: "- HTML, CSS, AJAX, JWT, EXPRESS, MongoDB"

},
{
  imageData:getImageData('cantstop') ,
  title: 'Cant stop',
  fillColor: "#2c3539",
  description: "Can't Stop is a virtual version of the popular board game, designed to provide an engaging and accessible gaming experience. Developed by a team of five for an academic project, the game features a non-human player for solo play, a color blind mode for enhanced accessibility, and adjustable difficulty levels to cater to all skill levels. Players can save their progress and load saved games, ensuring a seamless and enjoyable experience.",
  tech:'- Java Swing'
},
{
  imageData: getImageData('zombiechase'),
  title: 'Zombie Chase',
  description: 'Zombie Chase is an action-packed shooting game developed in Unreal Engine using Blueprints. In this thrilling game, players must cross a zombie-infested bridge, picking up weapons and battling hordes of zombies along the way. HealthKits are strategically placed to help players restore their health and continue their journey. With immersive graphics and intense gameplay, Zombie Chase offers an exhilarating experience for all zombie survival enthusiasts.',
  tech: '- Unreal Engine'
},
{
  imageData: getImageData('rma'),
  title: 'Bigbull',
  description: 'Bigbull is a 3D book viewer built with React Three Fiber and Three.js. It allows you to create interactive 3D book models that can be viewed in a web browser.',
},
]