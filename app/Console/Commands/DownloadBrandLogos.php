<?php

namespace App\Console\Commands;

use Illuminate\Console\Attributes\Description;
use Illuminate\Console\Attributes\Signature;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\File;

#[Signature('brands:download-logos {--force : Re-download even if file already exists}')]
#[Description('Download car brand logos into public/images/brands/')]
class DownloadBrandLogos extends Command
{
    // ext = file extension to save as (png or svg)
    private const LOGOS = [
        'audi'       => ['url' => 'https://commons.wikimedia.org/wiki/Special:FilePath/Audi-Logo_2016.svg?width=300',              'ext' => 'png'],
        'bmw'        => ['url' => 'https://commons.wikimedia.org/wiki/Special:FilePath/BMW.svg?width=300',                         'ext' => 'png'],
        'chevrolet'  => ['url' => 'https://commons.wikimedia.org/wiki/Special:FilePath/Chevrolet-logo.png?width=300',              'ext' => 'png'],
        'dodge'      => ['url' => 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b0/Dodge_2022_logo.svg/250px-Dodge_2022_logo.svg.png', 'ext' => 'png'],
        'ford'       => ['url' => 'https://commons.wikimedia.org/wiki/Special:FilePath/Ford_logo_flat.svg?width=300',              'ext' => 'png'],
        'honda'      => ['url' => 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/76/Honda_logo.svg/250px-Honda_logo.svg.png', 'ext' => 'png'],
        'hyundai'    => ['url' => 'https://commons.wikimedia.org/wiki/Special:FilePath/Hyundai_Motor_Company_logo.svg?width=300',  'ext' => 'png'],
        'jeep'       => ['url' => 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/92/Jeep_wordmark.svg/250px-Jeep_wordmark.svg.png', 'ext' => 'png'],
        'kia'        => ['url' => 'https://upload.wikimedia.org/wikipedia/commons/b/b6/KIA_logo3.svg',                             'ext' => 'svg'],
        'lexus'      => ['url' => 'https://commons.wikimedia.org/wiki/Special:FilePath/Lexus_logo.svg?width=300',                  'ext' => 'png'],
        'mercedes'   => ['url' => 'https://commons.wikimedia.org/wiki/Special:FilePath/Mercedes-Benz_Logo_2010.svg?width=300',     'ext' => 'png'],
        'nissan'     => ['url' => 'https://commons.wikimedia.org/wiki/Special:FilePath/Nissan_logo.svg?width=300',                 'ext' => 'png'],
        'tesla'      => ['url' => 'https://commons.wikimedia.org/wiki/Special:FilePath/Tesla_Motors.svg?width=300',                'ext' => 'png'],
        'toyota'     => ['url' => 'https://commons.wikimedia.org/wiki/Special:FilePath/Toyota_carlogo.svg?width=300',              'ext' => 'png'],
        'volkswagen' => ['url' => 'https://commons.wikimedia.org/wiki/Special:FilePath/Volkswagen_logo_2019.svg?width=300',        'ext' => 'png'],
    ];

    public function handle(): void
    {
        $dir   = public_path('images/brands');
        $force = $this->option('force');
        File::ensureDirectoryExists($dir);

        $ok   = 0;
        $fail = 0;

        foreach (self::LOGOS as $slug => $entry) {
            $url  = $entry['url'];
            $ext  = $entry['ext'];
            $dest = "{$dir}/{$slug}.{$ext}";

            // Also skip if the other extension already exists
            $altExt  = $ext === 'png' ? 'svg' : 'png';
            $altDest = "{$dir}/{$slug}.{$altExt}";

            if (!$force && (File::exists($dest) || File::exists($altDest))) {
                $this->line("  <comment>skip</comment>  {$slug}");
                continue;
            }

            $content = $this->fetch($url);

            if ($content !== null) {
                File::put($dest, $content);
                $this->line("  <info>ok</info>    {$slug} (" . \strlen($content) . " bytes, .{$ext})");
                $ok++;
            } else {
                $this->line("  <error>fail</error>  {$slug}");
                $fail++;
            }
        }

        $this->newLine();
        $this->info("Done — {$ok} downloaded, {$fail} failed.");
    }

    private function fetch(string $url): ?string
    {
        $context = stream_context_create([
            'ssl'  => ['verify_peer' => false, 'verify_peer_name' => false],
            'http' => [
                'method'          => 'GET',
                'header'          => implode("\r\n", [
                    'User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120.0.0.0 Safari/537.36',
                    'Accept: image/png,image/svg+xml,image/*,*/*;q=0.8',
                    'Accept-Language: en-US,en;q=0.9',
                    'Referer: https://en.wikipedia.org/',
                    'Cache-Control: no-cache',
                    'Connection: keep-alive',
                ]) . "\r\n",
                'follow_location' => 1,
                'max_redirects'   => 10,
                'timeout'         => 20,
            ],
        ]);

        $content = @file_get_contents($url, false, $context);

        return ($content !== false && \strlen($content) > 50) ? $content : null;
    }
}
