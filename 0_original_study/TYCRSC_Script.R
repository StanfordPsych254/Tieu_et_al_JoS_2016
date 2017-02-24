rm(list = ls(all = TRUE))

library(lme4)
library(plyr)
library(ggplot2)
library(shape)


#################
# Load the data
#################

Y<-read.csv("http://semanticsarchive.net/Archive/mE4YmYwN/TYCRSC_AcqDisj.csv")


infos.subject<-data.frame(
PARTICIPANT=tapply(as.character(Y$participant), Y$participant, max),
TYPE=tapply(as.character(Y$AgeGroup), Y$participant, max),
LANG=tapply(as.character(Y$Lang), Y$participant, max),
AGE=tapply(Y$ageD, Y$participant, max),
SITE=tapply(as.character(Y$exp.site), Y$participant, max),
VERSION=tapply(as.character(Y$version), Y$participant, max),
COMPLEX=tapply((Y$Complex), Y$participant, max)
)


infos.subject$Correct<-tapply(Y$correct[Y$Condition=="Control"],Y$participant[Y$Condition=="Control"],mean,na.rm=T)

excluded<-infos.subject$PARTICIPANT[infos.subject$Correct<.7]

###################################################
# Remove training items and excluded participants
###################################################

Y<-subset(Y,Condition!="Training" & !participant%in%excluded)

# Prepare data for mixed-models:
data<-subset(Y,Condition!="Control"&response!=0.5)

contrasts(data$Complex)<-contr.sum(2)
data$Condition<-factor(data$Condition)
contrasts(data$Condition)<-contr.sum(2)
contrasts(data$AgeGroup)<-contr.sum(2)
data$Lang <-factor(data$Lang)
contrasts(data$Lang)<-contr.sum(2)


#################
# 1DT comparison
#################

data1DT<-subset(data,Condition=="1DT")

mod1DT<-glmer(response~AgeGroup+Complex*Lang+(1|participant),family=binomial(link="logit"),data= data1DT)
model1<-glmer(response~AgeGroup+(1|participant) + (1|item.name),family=binomial(link="logit"),data= data1DT)

summary(model1)

mod1DT0<-glmer(response~1+Complex*Lang+(1|participant),family=binomial(link="logit"),data= data1DT)

anova(mod1DT,mod1DT0)


#################
# 2DT comparison
#################

data2DT<-subset(data,Condition=="2DT")


mod2DT<-glmer(response~AgeGroup+Complex*Lang+(1|participant),family=binomial(link="logit"),data= data2DT)
mod2DT0<-glmer(response~1+Complex*Lang+(1|participant),family=binomial(link="logit"),control=glmerControl(optimizer="bobyqa", optCtrl=list(maxfun=5e6)),data= data2DT)

anova(mod2DT0,mod2DT)


################
# Effect of age
################


Z<-subset(data,AgeGroup=="child")
Z$Age<-scale(Z$ageD)

mod12DTAge<-glmer(response~Age*Condition*Complex*Lang+(1+Condition|participant),family=binomial(link="logit"),control=glmerControl(optimizer="bobyqa", optCtrl=list(maxfun=5e6)),data=subset(Z))
mod12DTAge0<-glmer(response~Condition*Complex*Lang+(1+Condition|participant),family=binomial(link="logit"),control=glmerControl(optimizer="bobyqa", optCtrl=list(maxfun=5e6)),data=subset(Z))

anova(mod12DTAge, mod12DTAge0)
summary(mod12DTAge)


#####################
# Graph (Figure 2)
#####################

tmp<-aggregate(response~Condition+AgeGroup+participant+Complex+Lang,FUN=mean,data=subset(Y,(Condition%in%c("1DT","2DT"))))

se<- function(x) sqrt(var(x,na.rm=TRUE)/length(na.omit(x)))

plot.data<-ddply(tmp,c("Condition",'AgeGroup','Complex','Lang'),function(df)c(Mean=100*mean(df$response),SE=100*se(df$response)))

plot.data $Complex<-factor(plot.data $Complex,levels=c(F,T),labels=c('Simple disjunction','Complex disjunction'))
plot.data $AgeGroup<-factor(plot.data $AgeGroup,levels=c('child','adult'),labels=c('Child','Adult'))
plot.data $Xfac<-factor(paste(plot.data $AgeGroup, plot.data $Condition),levels=c('Child 1DT','Child 2DT','Adult 1DT','Adult 2DT'))
plot.data $Group<-plot.data $AgeGroup
plot.data $Lang<-factor(plot.data $Lang,levels=c("Japanese","French"))

colors<-c(rgb(0,0,1,.75),rgb(1,.65,0,.75))
quartz(height=6,width=9)
bars<-c("transparent",'black','transparent','black')
p<-ggplot(plot.data,aes(x=Xfac,y=Mean,fill=Group)) +
	scale_fill_manual(values=colors) +
	geom_bar (position=position_dodge(), stat="identity",colour="black") +
	geom_bar (position=position_dodge(), stat="identity",fill="transparent", colour=bars,width=.6,size=.2) +
	geom_bar (position=position_dodge(), stat="identity",fill="transparent", colour=bars,width=.2,size=.2) +
	facet_grid(Lang~Complex) +
    geom_errorbar(aes(ymin = Mean-SE, ymax = Mean+SE), size=.3,width=.4) +
	scale_y_continuous(breaks=c(0,25,50,75,100), minor_breaks=c(), limits=c(0,100)) +
	xlab("") + ylab("% ???Yes??? response")
print(p)

#####################
# Graph (Figure 3)
#####################


YY2<-aggregate(response~Condition+AgeGroup+participant+Complex+Lang,FUN=mean,na.rm=T,data=subset(Y,Y$Condition!="Control"))

diam<-42
gcol<-c("orange","blue");gpch=c(16,17);

par(mfrow=c(2,2),cex=1,pch=1,oma = c(5, 2, 1, 1),mai=c(0,1,1,0)*0.5) # Green = child / red = adult

plot(c(150,150),c(150,200),xlim=c(-2,102),ylim=c(-2,102), xlab="", ylab="Japanese", main="",cex=1.25);mtext("Japanese",outer=F,las=3,side=2,line=2);filledcircle(r1=diam,r2=0,mid=c(-2,102),from=-.72,to=pi-.72,col='gray');filledcircle(r1=diam,r2=0,mid=c(102,102),from=-pi,to=pi, col='gray');filledcircle(r1=diam,r2=0,mid=c(102,-2),from=-.72,to=pi-.72,col='gray');points(jitter(100*YY2$response[YY2$Condition=="2DT"&YY2$Lang=="Japanese"&YY2$Complex==F],amount=3) ~ jitter(100*YY2$response[YY2$Condition=="1DT"&YY2$Lang=="Japanese"&YY2$Complex==F],amount=3), col=gcol[as.numeric(YY2$AgeGroup[YY2$Condition=="1DT"&YY2$Lang=="Japanese"&YY2$Complex==F]=="child")+1], pch=gpch[as.numeric(YY2$AgeGroup[YY2$Condition=="1DT"&YY2$Lang=="Japanese"&YY2$Complex==F]=="child")+1],cex=1.25);abline(a=100,b=-1);mtext("Japanese",outer=F,las=3,side=2,line=2);text(90,82,labels="Incl.");text(94,25,labels="Excl.");text(20,92,labels="Conj.");abline(h=106);abline(v=106)
plot(jitter(100*YY2$response[YY2$Condition=="2DT"&YY2$Lang=="Japanese"&YY2$Complex==T],amount=3) ~ jitter(100*YY2$response[YY2$Condition=="1DT"&YY2$Lang=="Japanese"&YY2$Complex==T],amount=3), xlim=c(-2,102),ylim=c(-2,102), xlab="", ylab="", main="", col=gcol[as.numeric(YY2$AgeGroup[YY2$Condition=="1DT"&YY2$Lang=="Japanese"&YY2$Complex==T]=="child")+1], pch=gpch[as.numeric(YY2$AgeGroup[YY2$Condition=="1DT"&YY2$Lang=="Japanese"&YY2$Complex==T]=="child")+1],cex=1.25);abline(a=100,b=-1)
plot(jitter(100*YY2$response[YY2$Condition=="2DT"&YY2$Lang=="French"&YY2$Complex==F],amount=3) ~ jitter(100*YY2$response[YY2$Condition=="1DT"&YY2$Lang=="French"&YY2$Complex==F],amount=3), xlim=c(-2,102),ylim=c(-2,102), xlab="Simple disjunction", ylab="French", main="", col=gcol[as.numeric(YY2$AgeGroup[YY2$Condition=="1DT"&YY2$Lang=="French"&YY2$Complex==F]=="child")+1], pch=gpch[as.numeric(YY2$AgeGroup[YY2$Condition=="1DT"&YY2$Lang=="French"&YY2$Complex==F]=="child")+1],cex=1.25);abline(a=100,b=-1)
mtext("French",outer=F,las=3,side=2,line=2)
mtext("Simple disjunction",outer=F,las=1,side=1,line=2)
plot(jitter(100*YY2$response[YY2$Condition=="2DT"&YY2$Lang=="French"&YY2$Complex==T],amount=3) ~ jitter(100*YY2$response[YY2$Condition=="1DT"&YY2$Lang=="French"&YY2$Complex==T],amount=3), xlim=c(-2,102),ylim=c(-2,102), xlab="Complex disjunction", ylab="", main="", col=gcol[as.numeric(YY2$AgeGroup[YY2$Condition=="1DT"&YY2$Lang=="French"&YY2$Complex==T]=="child")+1], pch=gpch[as.numeric(YY2$AgeGroup[YY2$Condition=="1DT"&YY2$Lang=="French"&YY2$Complex==T]=="child")+1],cex=1.25);abline(a=100,b=-1)
mtext("Complex disjunction",outer=F,las=1,side=1,line=2)
mtext("Individual results (   =child,   =adult)", outer = TRUE, cex = 1.5,line=-1)
mtext("Percent 'Yes' to 2-disjunct targets",outer=T,las=3,side=2,line=1)
mtext("Percent 'Yes' to 1-disjunct targets",outer=T,las=1,side=1,line=3)

# Legend in the title manually added, feel free to improve

###########################
# Categorizing subjects
###########################


OneDisj<-tapply(Y$response[Y$Condition=="1DT"],Y$participant[Y$Condition=="1DT"],mean) # Prop true on 1 true disjunct targets
TwoDisj<-tapply(Y$response[Y$Condition=="2DT"],Y$participant[Y$Condition=="2DT"],mean) # Prop true on 2 true disjunct targets

infos.subject$Category<-NA
infos.subject[OneDisj>.5&TwoDisj>.5&!is.na(OneDisj),"Category"]<-"Incl"
infos.subject[OneDisj>.5&TwoDisj<.5&!is.na(OneDisj),"Category"]<-"Excl"
infos.subject[OneDisj<.5&TwoDisj>.5&!is.na(OneDisj),"Category"]<-"Conj"

infos.subject$Category<-factor(infos.subject$Category,levels=c("Incl","Conj","Excl"))

# Children vs. Adults:
table(infos.subject$Category,infos.subject$TYPE)

# Table 2:
table(infos.subject$Category[infos.subject$TYPE=="child"],infos.subject$COMPLEX[infos.subject$TYPE=="child"],infos.subject$LANG[infos.subject$TYPE=="child"])


# Build the corresponding data.frame:

df<-expand.grid(unique(factor(infos.subject$Category[!is.na(infos.subject$Category)])),unique(infos.subject$COMPLEX),unique(infos.subject$LANG),unique(factor(infos.subject$TYPE)))
names(df)<-c("Category","COMPLEX","LANG","TYPE")
#df$Count<-0

df2<-aggregate(PARTICIPANT~Category+LANG+ COMPLEX +TYPE,FUN=length,data=subset(infos.subject,!PARTICIPANT%in%excluded))
ddf<-merge(df2,df,all=T)
names(ddf)[5]<-"Count"
ddf$Count[is.na(ddf$Count)]<-0

ddf$Offset<-table(paste(infos.subject$LANG[!infos.subject$PARTICIPANT%in%excluded],infos.subject$COMPLEX[!infos.subject$PARTICIPANT%in%excluded],infos.subject$TYPE[!infos.subject$PARTICIPANT%in%excluded]))
ddf$Category<-factor(ddf$Category,levels=c("Excl","Incl","Conj"))

ddf$TYPE<-factor(ddf$TYPE,levels=c("child","adult"))
ddf$LANG<-factor(ddf$LANG)
ddf$COMPLEX<-factor(ddf$COMPLEX)
contrasts(ddf$LANG)<-contr.sum(2)
contrasts(ddf$COMPLEX)<--contr.sum(2)


#################
# chi2 tests:
#################

# Fewer exclusive children than adults:
data1<-as.matrix(ddply(subset(ddf,Category=="Excl"),"TYPE",function(d)c(C1=sum(d$Count),C2=sum(d$Offset-d$Count)))[,2:3])
chisq.test(data1)

# No difference between Inclusive and Conjunctive children:
data2<-as.matrix(ddply(subset(ddf,TYPE=="child"&Category!="Excl"),"Category",function(d)c(C1=sum(d$Count),C2=sum(d$Offset-d$Count)))[,2:3])
chisq.test(data2)


##################
# Poisson models:
##################

CategoryModel<-glm(Count~Category, family=quasipoisson, offset=log(Offset), data=subset(ddf,TYPE=="child"))

InterceptModel<-glm(Count~1,family=quasipoisson,offset=log(Offset),data=subset(ddf,TYPE=="child"))
# Dispersion parameters close to 1 for both models

SaturatedModel<-glm(Count~Category*COMPLEX*LANG,family=poisson,offset=log(Offset),data=subset(ddf,TYPE=="child"))
# Note: for saturated model, no need for quasipoisson (no residual deviance)


(Comparison1<-anova(InterceptModel,CategoryModel))
# p-value:
1-pchisq(Comparison1[2,4], Comparison1[2,3])

(Comparison2<-anova(CategoryModel, SaturatedModel))
# p-value:
1-pchisq(Comparison2[2,4], Comparison2[2,3])



