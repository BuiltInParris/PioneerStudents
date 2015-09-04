# PioneerStudents
A website for Tinashe Tapera, designed to connect prospective students with current students from their hometown.
Created and designed by Alex Marion and Stevie Parris.

OBJECTIVES:
	Our objective in creating Pioneer Students was to create an intuitive
	platform to connect international students on a global level. We aimed to
	design a clean user experience which would give international students a
	sense of a university from another student's perspective without having to 
	travel. This website organizes and connects students from different countries 
	to different universities, with the ability to search from a country of 
	origin or a destination school. Once the user has found their query, 
	they can read distributors blogs and view blog posts and images from their 
	peers. 

IMPLIMENTATION:
	Our project was created in NodeJS which is used as a foundation for our
	services and libraries. The site is written in jade, java-script, css,
	bash, and html. 
	To acheive our goals we implimented several different web services,
	libraries and API's. Breaking our website into different portions of 
	functionality we generated a list of useful services which we implimented
	step by step to create functionality in our site.
	Mapping Libraries:
		- D3 Maps 
		- Natural Earth
		- Geospatial Data Abstraction Library (GDAL)
		- Topojson
		- mapshaper.org
	UI:
		- Bootstrap
	Security:
		- Passport
		- Bcrypt
	Data and Storage:
		- MongoDB
	API's:
		- Google Geocoder
	Blogging:
		- Ghost Blogs
	Our mapping libraries were the first to be implimented and we combined them
	to create a landing page map which shows existing distributors and links to
	their blogs. Our choice of Bootstrap allows us to dynamically resize our
	web page and allows for mobile integration as well. Our site uses
	Passport's services to create a database (MongoDB) of users and passwords,
	which bcrypt then encrypts. Our page also has an administator panel in
	which new users can be created, new admins created, and users can be
	deleted. Using passports authentification these pages are only available to
	administrators. Finally, each time a user is created a Ghost Blog is
	generated and then populated by the user.  

RESULTS:
	