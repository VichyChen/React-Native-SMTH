//
//  GDTNativeExpressAdManager.h
//  SMTH
//
//  Created by 陈大捷 on 2018/11/30.
//  Copyright © 2018年 Facebook. All rights reserved.
//

#import <Foundation/Foundation.h>
#import "GDTNativeExpressAd.h"
#import "GDTNativeExpressAdView.h"
#import <React/RCTBridgeModule.h>
#import <React/RCTLog.h>

@interface GDTNativeExpressAdManager : NSObject <RCTBridgeModule>

@property (nonatomic, strong) GDTNativeExpressAd *nativeExpressAd;

@property (nonatomic, strong) NSMutableArray <GDTNativeExpressAdView *>*expressAdViews;

- (instancetype)initWithAppId:(NSString *)appId placementId:(NSString *)placementId adSize:(CGSize)size;

- (void)loadAd;

- (UIView *)getAd:(NSInteger)adTag;

- (void)removeAds:(NSArray *)array;

@end
