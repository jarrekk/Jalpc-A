# Jalpc-A.

<https://Jack614.github.io>

![Jalpc-A](Jalpc-A.gif)

Jalpc-A is a front end web application, it is written in Angularjs and the style and theme is similar with [Jalpc-A](http://Jack614.github.com/jalpc_jekyll_theme)

We can register an account at this website then login to do other things,since the backhend platform is based on [Leancloud](https://leancloud.cn/),you can use [Parse](https://parse.com/) as well.

If you like this Jekyll theme,please give me encouragement and star this project,I will make it better.

## Getting Started

If you're completely new to Jekyll, I recommend checking out the documentation at <http://jekyllrb.com> or there's a tutorial by Smashing Magazine.

### Fork, then clone

**Fork** the repo, and then **clone** it so you've got the code locally.

```
$ git clone https://github.com/<your githubname>/Jack614.github.io.git
$ cd Jack614.github.io
$ gem install jekyll # If you don't have jekyll installed
$ rm -rf _site && jekyll server
```
### Get a Leancloud account

Register an account at **Leancloud** and create a application, then in the settings of application you can get your **App ID** and **App Key**, replace them in `js/app.js`.

![Leancloud-app](Leancloud-app.jpg)

> **Parse** is similar.

### Jekyll Serve

Then, start the Jekyll Server. I always like to give the --watch option so it updates the generated HTML when I make changes.

```
$ jekyll serve --watch
```

Now you can navigate to localhost:4000 in your browser to see the site.

### Npm

You can use npm or other local web service to view the web site,remember to remove front matter in `website.html`.

### Using Github Pages

You can host your Jekyll site for free with Github Pages. [Click here](https://pages.github.com) for more information.

A configuration tweak if you're using a gh-pages sub-folder

Rename the repository to `<your githubname>.github.io` and create a branch named `gh-pages` then you will get a **https** website: `https://<your githubname>.github.io`.

### Web analytics

I use [Google analytics](https://www.google.com/analytics/) to do web analytics, you can register an account and apply an application, just replace the javascript code in `website.html`.

### Rich Text Editor

I use [summernote](https://github.com/summernote/angular-summernote) to generate a rich text editor at web page,you can write many styles of words and add pictures, videos and so on.It's very easy to write an article.

### Share

Every blog, I generate a QRCode image with [angular-qrcode](https://github.com/monospaced/angular-qrcode),this is the absURL about the blog,you can get the blog in other devices and share.

### Comment

* Login and comment
* Reply to others' comments
* Delete your previous comments

### Safe

Since the project is **open source**, we must consider user's username and password and safe connection.The below is analysis chart when use access to the website.

![connect](connect.png)

Client get the web application files(html,css,js),the push requrst to Leancloud, now both connect use https and Angularjs only save user's token on brower.

### To Do

* search page
* pagination
* donate

### Put in a Jalpc-A Plug

If you want to give credit to the Jalpc-A theme with a link to my personal website <http://Jack614.github.io>, that'd be awesome. No worries if you don't.
 
### Enjoy

I hope you enjoy using Jalpc-A. If you encounter any issues, please feel free to let me know by creating an issue. I'd love to help.

## Upgrading Jalpc-A

Jalpc-A is always being improved by its users, so sometimes one may need to upgrade.

### Ensure there's an upstream remote

If `git remote -v` doesn't have an upstream listed, you can do the following to add it:

```
git remote add upstream https://github.com/johnotander/pixyll.git
```

### Pull in the latest changes

```
git pull upstream master
```

There may be merge conflicts, so be sure to fix the files that git lists if they occur. That's it!

## Thanks to the following

* [Jekyll](http://jekyllrb.com)
* [Bootstrap](http://www.bootcss.com)
* [ui-router](https://github.com/angular-ui/ui-router)
* [angular-toastr](https://github.com/Foxandxss/angular-toastr)
* [angular-summernote](https://github.com/summernote/angular-summernote)
* [angular-qrcode](https://github.com/monospaced/angular-qrcode)

## Contributing

1. Fork it
2. Create your feature branch (`git checkout -b my-new-feature`)
3. Commit your changes (`git commit -am 'Add some feature'`)
4. Push to the branch (`git push origin my-new-feature`)
5. Create new Pull Request

