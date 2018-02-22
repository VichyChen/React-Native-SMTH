//
//  SMNetworkAPI.m
//  SMTH
//
//  Created by mac on 2017/9/6.
//  Copyright © 2017年 Facebook. All rights reserved.
//

#import "SMNetworkAPI.h"
#import "SMTHURLConnection.h"

@implementation SMNetworkAPI

RCT_EXPORT_MODULE();

RCT_EXPORT_METHOD(loginWithName:(NSString *)name password:(NSString *)password callback:(RCTResponseSenderBlock)callback)
{
  RCTLogInfo(@"loginWithName:%@ password:%@", name, password);
  
  SMTHURLConnection *api = [[SMTHURLConnection alloc] init];
  [api reset_status];
  int i = [api net_LoginBBS:name :password];
  NSLog(@"net_LoginBBS result:%d", i);
  
  callback(@[[NSNull null], [NSNumber numberWithInt:i]]);
}

RCT_EXPORT_METHOD(net_LoadSectionHot:(NSString *)section callback:(RCTResponseSenderBlock)callback)
{
  RCTLogInfo(@"net_LoadSectionHot: section=%@", section);
  
  SMTHURLConnection *api = [[SMTHURLConnection alloc] init];
  [api reset_status];
  NSArray *array = [api net_LoadSectionHot:(long)section];
  NSLog(@"net_LoadSectionHot result:%@", array);
  
  callback(@[[NSNull null], array]);
}

RCT_EXPORT_METHOD(net_GetThread:(NSString *)board_id :(NSString *)article_id :(NSString *)from :(NSString *)size :(NSString *)sort callback:(RCTResponseSenderBlock)callback)
{
  RCTLogInfo(@"net_GetThread: board_id=%@, article_id=%@, from=%@, size=%@, sort=%@", board_id, article_id, from, size, sort);
  
  SMTHURLConnection *api = [[SMTHURLConnection alloc] init];
//  [api reset_status];
//  NSArray *array = [api net_GetThread:board_id :(long)article_id :(long)from :(long)size :(int)sort];
  NSArray *array = [api net_GetThread:board_id :article_id.intValue :from.intValue :size.intValue :sort.intValue];
  NSLog(@"net_GetThread result:%@", array);
  
  callback(@[[NSNull null], array]);
}




@end
