/**
 * Copyright (c) 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 */

#import "AppDelegate.h"
#import <CodePush/CodePush.h>

#import <React/RCTBundleURLProvider.h>
#import <React/RCTRootView.h>
#import "SMTHURLConnection.h"
#import "GDTSplashAd.h"
#import "UIImage+CommonMethods.h"
#import <UIKit/UIKit.h>
#import <UMengAnalytics/UMMobClick/MobClick.h>


@interface AppDelegate() <GDTSplashAdDelegate>

@property (strong, nonatomic) GDTSplashAd *splash;
@property (strong, nonatomic) UILabel *skipLabel;
@end

@implementation AppDelegate

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
  //友盟统计
  [self UMengAnalytics];

  NSURL *jsCodeLocation;
  
//  jsCodeLocation = [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"index.ios" fallbackResource:nil];
  
  
#ifdef DEBUG
  //调试
 jsCodeLocation = [NSURL URLWithString:@"http://127.0.0.1:8081/index.ios.bundle?platform=ios&dev=true"];
  //本地打包
//     jsCodeLocation = [[NSBundle mainBundle] URLForResource:@"bundle/index.ios" withExtension:@"jsbundle"];
#else
  //发布热更新
  jsCodeLocation = [CodePush bundleURL];
#endif

  
  RCTRootView *rootView = [[RCTRootView alloc] initWithBundleURL:jsCodeLocation
                                                      moduleName:@"SMTH"
                                               initialProperties:nil
                                                   launchOptions:launchOptions];
  rootView.backgroundColor = [[UIColor alloc] initWithRed:1.0f green:1.0f blue:1.0f alpha:1];
  
  self.window = [[UIWindow alloc] initWithFrame:[UIScreen mainScreen].bounds];
  UIViewController *rootViewController = [UIViewController new];
  rootViewController.view = rootView;
  self.window.rootViewController = rootViewController;
  [self.window makeKeyAndVisible];
  
#if FREEVERSION
//  [self setupADInterstitialTime];
  [self configureSplashAd];
#endif
  
  
  
  return YES;
}

- (void)applicationDidBecomeActive:(UIApplication *)application {
#if FREEVERSION
//  NSDate *date = [Util getNSDateWithDateString:[NSUD stringForKey:kGCToday] format:@"yyyy-MM-dd HH:mm:ss"];
//  NSTimeInterval timeInterVal = -[date timeIntervalSinceDate:[Util getDate]];
//  if (timeInterVal > kGDTSplashTShowTimeInterVal) {
//    [self setupADInterstitialTime];
//    [self configureSplashAd];
//  }
#endif
}

#pragma mark - GDTSplashAdDelegate

/**
 *  开屏广告成功展示
 */
-(void)splashAdSuccessPresentScreen:(GDTSplashAd *)splashAd {
  NSLog(@"GDT开屏广告成功展示");
  [GCStatistics event:GCStatisticsEventGDTSplashShowSuccess extra:nil];
}

/**
 *  开屏广告展示失败
 */
- (void)splashAdFailToPresent:(GDTSplashAd *)splashAd withError:(NSError *)error {
  NSLog(@"GDT开屏广告展示失败");
  NSString *errorInfo = error.userInfo[@"NSLocalizedDescription"];
  [GCStatistics event:GCStatisticsEventGDTSplashShowFailure extra:@{ @"error" : String(errorInfo)}];
}

/**
 *  应用进入后台时回调
 *  详解: 当点击下载应用时会调用系统程序打开，应用切换到后台
 */
- (void)splashAdApplicationWillEnterBackground:(GDTSplashAd *)splashAd {
  NSLog(@"GDT应用进入后台时回调");}

/**
 *  开屏广告点击回调
 */
- (void)splashAdClicked:(GDTSplashAd *)splashAd {
  NSLog(@"GDT开屏广告点击回调");
  [GCStatistics event:GCStatisticsEventGDTSplashClick extra:nil];
}

/**
 *  开屏广告将要关闭回调
 */
- (void)splashAdWillClosed:(GDTSplashAd *)splashAd {
  NSLog(@"GDT开屏广告将要关闭回调");
}

/**
 *  开屏广告关闭回调
 */
- (void)splashAdClosed:(GDTSplashAd *)splashAd {
  NSLog(@"GDT开屏广告关闭回调");
  self.splash = nil;
}

/**
 *  开屏广告点击以后即将弹出全屏广告页
 */
- (void)splashAdWillPresentFullScreenModal:(GDTSplashAd *)splashAd {
  NSLog(@"GDT开屏广告点击以后即将弹出全屏广告页");
}

/**
 *  开屏广告点击以后弹出全屏广告页
 */
- (void)splashAdDidPresentFullScreenModal:(GDTSplashAd *)splashAd {
  NSLog(@"GDT开屏广告点击以后弹出全屏广告页");
}

/**
 *  点击以后全屏广告页将要关闭
 */
- (void)splashAdWillDismissFullScreenModal:(GDTSplashAd *)splashAd  {
  NSLog(@"GDT点击以后全屏广告页将要关闭");
}

/**
 *  点击以后全屏广告页已经关闭
 */
- (void)splashAdDidDismissFullScreenModal:(GDTSplashAd *)splashAd  {
  NSLog(@"GDT点击以后全屏广告页已经关闭");
}

/**
 * 开屏广告剩余时间回调
 */
- (void)splashAdLifeTime:(NSUInteger)time {
  NSLog(@"GDT开屏广告剩余时间回调 %ld", time);
  self.skipLabel.text = [NSString stringWithFormat:@"跳过 %ld", time - 1];
}

#pragma mark - UMengAnalytics

- (void)UMengAnalytics {
  UMAnalyticsConfig *config = [[UMAnalyticsConfig alloc] init];
  config.appKey = kUmengAppKey;
  [MobClick startWithConfigure:config];
  [MobClick setAppVersion:[[[NSBundle mainBundle] infoDictionary] objectForKey:@"CFBundleShortVersionString"]];
  [MobClick setEncryptEnabled:YES];
}

- (void)setupADInterstitialTime {
  [NSUD setObject:[Util getDateStringWithNSDate:[Util getDate] format:@"yyyy-MM-dd HH:mm:ss"] forKey:kGCToday];
  [NSUD synchronize];
}

- (void)configureSplashAd {
  NSString *imageName;
  CGRect defaultImageRect;
  //4
  if (ScreenWidth == 320) {
    imageName = @"AdLaunchImage_iPhone_4_640_1136";
    defaultImageRect = CGRectMake(0, 0, 640, 1136);
  }
  //4.7
  else if (ScreenWidth == 375 && ScreenHeight == 667) {
    imageName = @"AdLaunchImage_iPhone_4.7_750_1334";
    defaultImageRect = CGRectMake(0, 0, 750, 1334);
  }
  //5.5
  else if (ScreenWidth == 414 && ScreenHeight == 736) {
    imageName = @"AdLaunchImage_iPhone_5.5_1242_2208";
    defaultImageRect = CGRectMake(0, 0, 1242, 2208);
  }
  //5.8
  else if (ScreenWidth == 375 && ScreenHeight == 812) {
    imageName = @"AdLaunchImage_iPhone_5.8_1125_2436";
    defaultImageRect = CGRectMake(0, 0, 1125, 2436);
  }
  //6.1
  else if (ScreenWidth == 414 && ScreenHeight == 896) {
    imageName = @"AdLaunchImage_iPhone_6.1_828_1792";
    defaultImageRect = CGRectMake(0, 0, 828, 1792);
  }
  //6.5
  else if (ScreenWidth == 414 && ScreenHeight == 896) {
    imageName = @"AdLaunchImage_iPhone_6.5_1242_2688";
    defaultImageRect = CGRectMake(0, 0, 1242, 2688);
  }
  //7.9、9.7
  else if (ScreenWidth == 768 && ScreenHeight == 1024) {
    imageName = @"AdLaunchImage_iPad_9.7_1536_2048";
    defaultImageRect = CGRectMake(0, 0, 1536, 2048);
  }
  //10.5
  else if (ScreenWidth == 834 && ScreenHeight == 1112) {
    imageName = @"AdLaunchImage_iPad_10.5_1668_2224";
    defaultImageRect = CGRectMake(0, 0, 1668, 2224);
  }
  //11
  else if (ScreenWidth == 834 && ScreenHeight == 1194) {
    imageName = @"AdLaunchImage_iPad_11_1668_2388";
    defaultImageRect = CGRectMake(0, 0, 1668, 2388);
  }
  //12.9
  else if (ScreenWidth == 1024 && ScreenHeight == 1336) {
    imageName = @"AdLaunchImage_iPad_12.9_2048_2732";
    defaultImageRect = CGRectMake(0, 0, 2048, 2732);
  }
  //!@#$%^&*()
  else {
    imageName = @"AdLaunchImage_iPhone_5.5_1242_2208";
    defaultImageRect = CGRectMake(0, 0, 1242, 2208);
  }
  
  self.splash = [[GDTSplashAd alloc] initWithAppkey:kGDTAppKey placementId:kGDTSplashPlacementID];
  self.splash.fetchDelay = 3;
  self.splash.delegate = self;
  UIImage *defaultImage = [[[UIImage imageNamed:imageName] cutWithRect:defaultImageRect] resize:CGSizeMake(ScreenWidth, ScreenHeight)];
  self.splash.backgroundColor = [UIColor colorWithPatternImage:defaultImage];
  

  UIView *skipView = [[UIView alloc] initWithFrame:CGRectMake(ScreenWidth - 30 - 50, kNavigatioinBarHeight, 50, 30)];
  skipView.backgroundColor = [UIColor clearColor];
  skipView.clipsToBounds = YES;
  skipView.layer.cornerRadius = 4;
  
  UIView *view = [[UIView alloc] initWithFrame:CGRectMake(0, 0, 50, 30)];
  view.backgroundColor = [UIColor blackColor];
  view.alpha = 0.60;
  
  UILabel *label = [[UILabel alloc] init];
  label.frame = view.frame;
  label.text = @"跳过";
  label.textAlignment = NSTextAlignmentCenter;
  label.textColor = [UIColor whiteColor];
  label.font = [UIFont systemFontOfSize:14];
  
  self.skipLabel = label;
  
  [skipView addSubview:view];
  [skipView addSubview:label];
  
  [self.splash loadAdAndShowInWindow:APP.window withBottomView:nil skipView:skipView];
}

- (void)shareWithTitle:(NSString *)title url:(NSString *)url {
  UIActivityViewController *controller = [[UIActivityViewController alloc]  initWithActivityItems:@[title, [NSURL URLWithString:url]] applicationActivities: nil];
  [self.window.rootViewController presentViewController:controller animated:YES completion:nil];
}

@end
