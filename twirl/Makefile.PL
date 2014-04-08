use strict;
use warnings;
use ExtUtils::MakeMaker;

# Normalize version strings like 6.30_02 to 6.3002,
# so that we can do numerical comparisons on it.
my $eumm_version = $ExtUtils::MakeMaker::VERSION;
$eumm_version =~ s/_//;

WriteMakefile(
	NAME         => 'Twirl',
	AUTHOR       => q{"Daniel Schmidt" <danschmidt5189@example.com>},
	VERSION_FROM => 'lib/Twirl.pm',
	ABSTRACT     => 'Find common friends among Tweeps. A demo app built with Perl, Dancer, Redis, and Bootstrap.',
    ($eumm_version >= 6.3001
      ? ('LICENSE'=> 'perl')
      : ()),
	PL_FILES => {},
    PREREQ_PM => {
		'YAML'         => 0,
		'Test::More'   => 0,
		'Dancer'       => 1.3121,
		'Redis'        => 1.972,
		'Net::Twitter' => 4.01003,
		'JSON::PP'     => 2.27202,
    },
	dist  => { COMPRESS => 'gzip -9f', SUFFIX => 'gz', },
	clean => { FILES => 'Twirl-*' },
);
