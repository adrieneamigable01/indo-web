<?php

define('APP_ENV', 'production'); // change to production on live

define('APP_BASE', APP_ENV === 'development'
    ? '/indo-lending-system/'
    : '/');