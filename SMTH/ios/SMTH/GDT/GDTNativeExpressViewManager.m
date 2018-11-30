//
//  GDTNativeExpressViewManager.m
//  SMTH
//
//  Created by 陈大捷 on 2018/11/29.
//  Copyright © 2018年 Facebook. All rights reserved.
//

#import "GDTNativeExpressViewManager.h"
#import "GDTNativeExpressView.h"
#import "AppDelegate.h"

@implementation GDTNativeExpressViewManager

RCT_EXPORT_MODULE()

RCT_EXPORT_VIEW_PROPERTY(adTag, int);
RCT_EXPORT_VIEW_PROPERTY(onRenderSuccess, RCTBubblingEventBlock);

- (UIView *)view {
  return [[GDTNativeExpressView alloc] init];
}

@end
