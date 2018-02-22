//
//  GCStatistics.h
//  GuitarChina
//
//  Created by mac on 17/1/6.
//  Copyright © 2017年 陈大捷. All rights reserved.
//

#import <Foundation/Foundation.h>

typedef NS_ENUM(NSInteger, GCStatisticsEvent) {
  GCStatisticsEventGDTBannerShow,
  GCStatisticsEventGDTBannerClick,
  GCStatisticsEventGDTSplashShowSuccess,
  GCStatisticsEventGDTSplashShowFailure,
  GCStatisticsEventGDTSplashClick,
  GCStatisticsEventThreadDetail,
  GCStatisticsEventLogin,
  GCStatisticsEventPostThread,
  GCStatisticsEventReplyThread,
};

@interface GCStatistics : NSObject

+ (void)event:(GCStatisticsEvent)event extra:(NSDictionary *)extra;

@end
