var gulp = require('gulp');
var sass = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');
var concat = require('gulp-concat');
var clean = require('gulp-clean');
var notify = require('gulp-notify');
var plumber = require('gulp-plumber');
var sourcemaps = require('gulp-sourcemaps');
var browserSync = require('browser-sync').create();

// Задача с названием 'default' запускается автоматически по команде 'gulp' в консоле.
// Эта конструкция работает синхронно, сначала выполняется задача 'clean' и только после ее завершнения запускается 'dev'.
gulp.task('default', ['clean'], function() {
	gulp.run('dev');
});
// Аналогично с предыдушей задачей.
// Выполняет задача 'clean' и после ее завершения запускается 'build'.
gulp.task('production', ['clean'], function() {
	gulp.run('build');
});
// Задача 'dev' представляется собой сборку в режиме разработки.
// Запускает build - сборку, watcher - слежку за файлами и browser-sync.
gulp.task('dev', ['build', 'watch', 'browser-sync']);
// Задача 'build' представляет собой сборку в режиме продакшен.
// Собирает проект.
gulp.task('build', ['styles', 'scripts', 'assets']);
// Задача 'watch' следит за всеми нашими файлами в проекте и при изменении тех или иных перезапустает соответсвующую задачу.
gulp.task('watch', function() {
	gulp.watch('app/styles/**/*.scss', ['styles']); //стили
    gulp.watch('app/js/**/*.js', ['scripts']); //скрипты
    gulp.watch(['app/{img,fonts}/**/*.*', 'app/*.*'], ['assets']); //наши локальные файлы(картинки, шрифты) и index.html
    gulp.watch('app/**/*.*').on('change', browserSync.reload); //Перезапуск browserSynс
});

/**********Работа со стилями*****************/

// Задача 'styles' выполняет сборку наших стилей.
gulp.task('styles', function() {
	return gulp.src('app/styles/*.scss')
		.pipe(plumber({ // plumber - плагин для отловли ошибок.
			errorHandler: notify.onError(function(err) { // nofity - представление ошибок в удобном для вас виде.
				return {
					title: 'Styles',
					message: err.message
				}
			})
		}))
		.pipe(sourcemaps.init()) //История изменения стилей, которая помогает нам при отладке в devTools.
		.pipe(sass()) //Компиляция sass.
		.pipe(autoprefixer({ //Добавление autoprefixer.
			browsers: ['last 2 versions']
		}))
		.pipe(concat('main.css')) //Соедение всех файлом стилей в один и задание ему названия 'main.css'.
		.pipe(sourcemaps.write())
		.pipe(gulp.dest('build/css'))
});

//Задача для удаление папки build.
gulp.task('clean', function() {
	return gulp.src('build/')
		.pipe(clean());
})


/**********Работа со скриптами*****************/

gulp.task('scripts', function() {
  return gulp.src('app/js/**/*.js')
		.pipe(concat('main.js'))
		.pipe(gulp.dest('build/js'));
});

//Задача для запуска сервера.
gulp.task('browser-sync', function() {
	return browserSync.init({
		server: {
			baseDir: './build/'
		}
	});
});
//Перемешение наших локальных файлов в папку build
//gulp.task('assets', function() {
//	return gulp.src(['app/{img,fonts,styles/vendor,js/vendor}/**/*.*',
//	                 'app/*.*'])
//		.pipe(gulp.dest('build/'));
//});

gulp.task('assets', [
	'assets:img-fonts',
    'assets:styles',
    'assets:js'
]);


gulp.task('assets:img-fonts', function() {
    gulp.src(['app/{img,fonts}/**/*.*',
	                 'app/*.*'])
        .pipe(gulp.dest('build/'));
});

gulp.task('assets:styles', function() {
    gulp.src('app/styles/vendor/**/*.*')
        .pipe(gulp.dest('build/css/vendor/'));
});

gulp.task('assets:js', function() {
    gulp.src('app/js/vendor/**/*.*')
        .pipe(gulp.dest('build/js/vendor/'));
});







//'app/js/vendor/**/*.*'


/**********Работа с вендорными скриптами*****************/

/*gulp.task('copy-vendor', [
	'copy:normalize',
    'copy:jquery',
    'copy:modernizr',
    'copy:img:plugins'
]);

gulp.task('copy:normalize', function() {
    gulp.src('node_modules/normalize.css/normalize.css')
        .pipe(gulp.dest('build/css/'));
});

gulp.task('copy:jquery', function() {
    gulp.src('node_modules/jquery/dist/jquery.js')
        .pipe(gulp.dest('build/js/vendor'));
});
gulp.task('copy:modernizr', function() {
    gulp.src('node_modules/modernizr/modernizr.js')
        .pipe(gulp.dest('build/js/vendor'));
});
gulp.task('copy:img:plugins', function() {
    gulp.src('app/js/vendor/plugins.js')
        .pipe(gulp.dest('build/js/vendor'));
});
*/