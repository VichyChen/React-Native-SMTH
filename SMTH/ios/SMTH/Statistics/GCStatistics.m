//
//  GCStatistics.m
//  GuitarChina
//
//  Created by mac on 17/1/6.
//  Copyright © 2017年 陈大捷. All rights reserved.
//

#import "GCStatistics.h"
#import <UMengAnalytics/UMMobClick/MobClick.h>

@implementation GCStatistics

+ (void)event:(GCStatisticsEvent)event extra:(NSDictionary *)extra {
    NSMutableDictionary *attributes = [NSMutableDictionary dictionary];
    [attributes addEntriesFromDictionary:@{@"name" : @"游客"}];
    if (extra) {
        [attributes addEntriesFromDictionary:extra];
    }
    NSArray *array = @[@"GDTBannerShow", @"GDTBannerClick", @"GDTSplashShowSuccess", @"GDTSplashShowFailure", @"GDTSplashClick", @"ThreadDetail", @"Login", @"PostThread", @"ReplyThread"];

    [MobClick event:array[event] attributes:attributes];
}

@end
