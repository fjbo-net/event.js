'use-strict';

const
babel = require('gulp-babel'),
beautify = require('gulp-jsbeautifier'),
beautifyJsConfig = {
	indent_char: '\t',
	indent_size: 1
},
del = require('del'),
fs = require('fs'),
gulp = require('gulp'),
header = require('gulp-header'),
rename = require('gulp-rename'),
strip = require('gulp-strip-comments'),
uglify = require('gulp-uglify');


gulp.task('clean', callback => {
	let deletedPaths = del.sync(['dist']);

	if(deletedPaths.length > 0)
		console.log(
			'Deleted files and directories:\n',
			deletedPaths.join('\n'));

	callback();
});

gulp.task('copy:src', () => gulp
	.src(
		['./src/**/*'],
		{ base: './src/'}
	)
	.pipe(gulp.dest('./dist'))
);

gulp.task('copy:files', () => gulp
	.src([
		'./LICENSE',
		'./README.md',
	])
	.pipe(gulp.dest('./dist'))
);

gulp.task('js:package-json', callback => {
	let
	packageJson = require('./package.json'),
	itemsToRemove = [
		'devDependencies',
		'year'
	];

	for(let index in itemsToRemove){
		let propertyName = itemsToRemove[index];
		if(packageJson[propertyName]) delete(packageJson[propertyName]);
	}

	packageJson.main = 'event.js';

	fs.writeFile(
		'./dist/package.json',
		JSON.stringify(packageJson),
		err => {
			if(err) throw err;

			gulp.src('./dist/package.json')
				.pipe(
					beautify(beautifyJsConfig))
				.pipe(
					gulp.dest('./dist/'));
		}
	);

	callback();
});

gulp.task('js:prep', () => gulp
	.src(
		'./dist/**/*.js',
		{ base: './dist/'})
	.pipe(strip())
	.pipe(header(
		fs.readFileSync('./assets/ejs/license.ejs', 'utf-8'),
		{ pkg: require('./package.json') }
	))
	.pipe(babel())
	.pipe(beautify(beautifyJsConfig))
	.pipe(gulp.dest('./dist/'))
);

gulp.task('js:minify', () => gulp
	.src('./dist/event.js')
	.pipe(uglify())
	.pipe(rename({
		extname: '.min.js'
	}))
	.pipe(gulp.dest('./dist/'))
);


gulp.task('default', gulp
	.series(
		'clean',
		'copy:src',
		'js:prep',
		'js:minify',
		'js:package-json',
		'copy:files'
	)
);
