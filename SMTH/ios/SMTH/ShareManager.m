//
//  ShareManager.m
//  SMTH
//
//  Created by mac on 2017/12/29.
//  Copyright © 2017年 Facebook. All rights reserved.
//
#define APP ((AppDelegate *)[UIApplication sharedApplication].delegate)

#import "ShareManager.h"
#import <UIKit/UIKit.h>
#import "AppDelegate.h"

@implementation ShareManager

RCT_EXPORT_MODULE();

RCT_EXPORT_METHOD(share:(NSString *)title url:(NSString *)url)
{
  [APP shareWithTitle:title url:url];
}

@end
