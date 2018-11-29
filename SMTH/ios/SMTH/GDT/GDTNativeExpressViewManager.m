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

RCT_EXPORT_VIEW_PROPERTY(index, int);
RCT_EXPORT_VIEW_PROPERTY(onReceived, RCTBubblingEventBlock);

- (UIView *)view {
//  NSArray *array = ((AppDelegate *)[UIApplication sharedApplication].delegate).expressAdViews;
//  UIView *view;
//  if (array.count > 0) {
//    view = [array firstObject];
//  }
//  else {
//    view = [[UIView alloc] init];
//  }
//  self.zoomEnabled = YES;
//
//  return view;
  
  return [[GDTNativeExpressView alloc] init];
}

@end
