# GAMS listing file size reducer

Turns listing outputs like this:
```GAMS
---- VAR v_stableUsed  Stable inventory used in year t

                            LOWER          LEVEL          UPPER         MARGINAL

milk30        .2010.          .              .             1.0000         EPS
milk40        .2010.          .              .             1.0000         EPS
milk50        .2010.          .              .             1.0000         EPS
milk60        .2010.          .              .             1.0000         EPS
milk70        .2010.          .              .             1.0000         EPS
milk80        .2010.          .              .             1.0000         EPS
milk90        .2010.          .              .             1.0000         EPS
milk100       .2010.          .              .             1.0000         EPS
milk110       .2010.          .              .             1.0000         EPS
milk120       .2010.          .             0.7500         1.0000          .
milk130       .2010.          .              .             1.0000         EPS
youngCattle15 .2010.          .              .             1.0000         EPS
youngCattle30 .2010.          .              .             1.0000         EPS
youngCattle45 .2010.          .              .             1.0000         EPS
youngCattle60 .2010.          .             0.7500         1.0000          .
youngCattle75 .2010.          .              .             1.0000         EPS
youngCattle90 .2010.          .              .             1.0000         EPS
youngCattle120.2010.          .              .             1.0000         EPS
youngCattle150.2010.          .              .             1.0000         EPS
youngCattle180.2010.          .              .             1.0000         EPS
youngCattle210.2010.          .              .             1.0000         EPS
youngCattle240.2010.          .              .             1.0000         EPS
calves15      .2010.          .              .             1.0000         EPS
calves30      .2010.          .              .             1.0000         EPS
calves45      .2010.          .             0.7500         1.0000          .
```

into this

```GAMS
---- VAR v_stableUsed  Stable inventory used in year t

                            LOWER          LEVEL          UPPER         MARGINAL

milk120       .2010.          .             0.7500         1.0000          .
youngCattle60 .2010.          .             0.7500         1.0000          .
calves45      .2010.          .             0.7500         1.0000          .
```

Depending on your model, this can significantly reduce the size of the listing file, and ease readibility of the output.

## Usage
Download a relase from the relase tab and either place it in your models main directory (where your GAMS entry file is)
or in the GAMS system directory (if you want to use it on multiple models).
Then, at the end of your main GAMS model file, put
```GAMS
execute 'redLstSize Your_Listing_File_Name.lst';
```

In some occasions, GAMS may not be finished writing to the `.lst` file when `reduce-lst-size` is called. In those cases, the `.lst` can end up with long empty lines.
You can circumvent this by using the `async` version of the `execute` function
```GAMS
execute.async 'redLstSize Your_Listing_File_Name.lst';
```

## Options
By default, `redLstSize` will filter out all lines in a variable/equation block, where
either the **level** or **marginal** value is zero/EPS.

You can control the behaviour by adding additional command line parameters:
```GAMS
execute 'redLstSize Your_Listing_File_Name.lst lo=true l=true up=true m=true';
```

If any of the values for **lo,l,up or m** is set to **true**, a line in a variable/equation block
**will not be thrown out** if it's value deviates from it's **default (e.g. .,EPS,+INF,-INF**)

As an example, if you wanted to filter out all lines with a variable/equation level
of 0, regardless of the marginal and lower/upper bound values, you would use:
```GAMS
execute 'redLstSize Your_Listing_File_Name.lst l=true';
```

## When not to use
When you're debugging your model, and you would like to check if the correct set
elements are entering an equation, it is recommended to disable this feature.

## Building
Clone/Fork this repo, then
```
npm install
```
followed by
```
nexe redLstSize.js
```
which will build an executable for your current OS.

## License
MIT
