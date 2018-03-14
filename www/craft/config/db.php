<?php

/**
 * Database Configuration
 *
 * All of your system's database configuration settings go in here.
 * You can see a list of the default settings in craft/app/etc/config/defaults/db.php
 */

 $servername = getenv('MYSQL_SERVER');
 $database = getenv('MYSQL_DATABASE');
 $username = getenv('MYSQL_USER');
 $password = getenv('MYSQL_PASSWORD');

return array(

	// The database server name or IP address. Usually this is 'localhost' or '127.0.0.1'.
	'server' => $servername,

	// The name of the database to select.
	'database' => $database,

	// The database username to connect with.
	'user' => $username,

	// The database password to connect with.
	'password' => $password,

	// The prefix to use when naming tables. This can be no more than 5 characters.
	'tablePrefix' => 'craft',

);
